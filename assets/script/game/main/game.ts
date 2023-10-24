/*
 * 游戏界面 
 */

import { _decorator, Component, EventTouch, find, instantiate, Label, Node, Prefab, Sprite, tween, UITransform, Vec2, Vec3 } from 'cc';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { blockCtr } from './blockCtr';
import { UIID } from '../common/config/GameUIConfig';
import { PopViewParams } from '../../../../extensions/oops-plugin-framework/assets/core/gui/layer/Defines';
import { GameEvent } from '../common/config/GameEvent';

const { ccclass, property } = _decorator;

const blockNum = 4;         // 4x4方格
const gapX = 8;             // 方块间隔
const gapY = 28;             // 方块间隔
const MOVE_DAURATION = 0.1; // 方块缓动时间
const bgWidth = 616;        // 方格背景板宽度
var blockSize = 148;        // 方块大小

@ccclass('game')
export class game extends Component {

    @property(Prefab)
    private blockPrefab: Prefab = null;

    private _mainPanel: Node = null;// 游戏面板
    private _audioBtn: Node = null; // 开启声音按钮
    private _muteBtn: Node = null;  // 关闭声音按钮
    private _scoreLb: Node = null;  // 得分显示
    private _bestLb: Node = null;   // 最佳得分显示

    private score: number = 0;  // 分数
    private best: number = 0;   // 最好成绩
    private next: number = 2;   // 下一个出现的方块数字
    private positions: Vec3[][] = [[], [], [], []];     // 各个块的位置
    private blocks: Node[][] = [[], [], [], []];        // 已有的块
    private numbers: number[][] = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];   // 各个块里的数字

    onLoad() {
        this._mainPanel = this.node.getChildByName("bg").getChildByName("square");
        let topNode = this.node.getChildByName("bg").getChildByName("top");
        this._audioBtn = topNode.getChildByName("audio");
        this._muteBtn = topNode.getChildByName("mute");
        this._scoreLb = topNode.getChildByName("score").getChildByName("num");
        this._bestLb = topNode.getChildByName("best").getChildByName("num");

        // 注册事件
        this._addEvent();
        // 根据缓存状态设置声音按钮显示
        this._setAudioState();
        // 设置最佳战绩
        this.best = oops.storage.getNumber("best");
        this._bestLb.getComponent(Label).string = this.best + "";
        // 方格背景设计宽度
        blockSize = (bgWidth - gapX * (blockNum + 1)) / blockNum;
        this.init();
        this._resetLayout();
    }

    start() {
        // 事件监听
        this.addEventHandler();  
    }

    onDestroy() {
        this._removeEvent();
    }

    // 初始化，随机两个方块
    init() {
        this.score = 0;
        oops.storage.set("score", 0);
        this.best = oops.storage.getNumber("best");
        this.positions = [[], [], [], []];
        this.blocks = [[], [], [], []];
        this.numbers = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
        this._scoreLb.getComponent(Label).string = this.score + "";
        this._bestLb.getComponent(Label).string = this.best + "";
        this.initBlocks();
        this.randomBlock();
        this.randomBlock();
    }

    // 随机一个方块
    randomBlock() {
        let positions = this._getEmptyPositions();
        if (positions.length == 0) {
            return false;
        } else {
            let position = positions[Math.floor(Math.random() * positions.length)];
            let row = position.row;
            let col = position.col;
            this.numbers[row][col] = this.next;
            let block = instantiate(this.blockPrefab);
            this._setBlockSize(block, blockSize);
            this._mainPanel.addChild(block);
            this.blocks[row][col] = block;
            block.setPosition(this.positions[row][col]);
            block.getComponent(blockCtr).setNumber(this.next);
            this.next = (Math.floor(Math.random() * 2) + 1) * 2;
            return true;
        }
    }

    // 绘制4x4空方格
    initBlocks() {
        let x = gapX + blockSize / 2;
        let y = blockSize / 2;
        for (let row = 0; row < blockNum; row++) {
            for (let col = 0; col < blockNum; col++) {
                let block = instantiate(this.blockPrefab);
                // 设置方格大小
                this._setBlockSize(block, blockSize);
                this._mainPanel.addChild(block);
                //方块位置
                let vec3 = new Vec3(x, y, 0);
                this.positions[row][col] = vec3;
                block.setPosition(vec3);
                block.getComponent(blockCtr).setNumber(0);
                x += gapX + blockSize;
            }
            x = gapX + blockSize / 2;
            y += gapY + blockSize;
        }
    }

    // 监听滑动事件
    addEventHandler() {
        let vec1: Vec2, vec2: Vec2
        this._mainPanel.on(Node.EventType.TOUCH_START, (e: EventTouch) => {
            vec1 = e.getLocation()
        }, this)
        this._mainPanel.on(Node.EventType.TOUCH_END, (e: EventTouch) => {
            vec2 = e.getLocation()
            this.getDirection(vec1, vec2)
        }, this)
        this._mainPanel.on(Node.EventType.TOUCH_CANCEL, (e: EventTouch) => {
            vec2 = e.getLocation()
            this.getDirection(vec1, vec2)
        }, this)
    }

    // 判断滑动方向
    getDirection(v1, v2) {
        let distance = Math.sqrt(Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2))
        if (distance > 100) {
            let distanceH = Math.abs(v1.x - v2.x)
            let distanceV = Math.abs(v1.y - v2.y)
            if (distanceH > distanceV) {//左右
                if (v1.x < v2.x) {//向右
                    this.moveRight()
                } else {//向左
                    this.moveLeft()
                }
            } else {//上下
                if (v1.y > v2.y) {//向下
                    this.moveDown()
                } else {//向上
                    this.moveUp()
                }
            }
        }
    }

    moveRight() {
        let flag = 0//标记：0 无效滑动  1方块移动 2方块合并
        for (let row = 0; row < blockNum; row++) {
            for (let col = blockNum - 1; col > 0; col--) {
                let nextCol = col - 1
                while (nextCol >= 0) {
                    let num1 = this.numbers[row][col]
                    let num2 = this.numbers[row][nextCol]
                    if (num1 == 0) {
                        if (num2 != 0) {
                            this.moveBlock(row, nextCol, row, col)
                            if (flag == 0) flag = 1
                        }
                        else {
                            nextCol--
                        }
                    } else {
                        if (num2 == 0) {
                            nextCol--
                        } else if (num2 == num1) {
                            this.mergeBlock(row, nextCol, row, col)
                            flag = 2
                            break
                        } else {
                            break
                        }
                    }
                }

            }
        }
        this.afterMove(flag)
    }

    moveLeft() {
        let flag = 0
        for (let row = 0; row < blockNum; row++) {
            for (let col = 0; col < blockNum - 1; col++) {
                let nextCol = col + 1
                while (nextCol < blockNum) {
                    let num1 = this.numbers[row][col]
                    let num2 = this.numbers[row][nextCol]
                    if (num1 == 0) {
                        if (num2 != 0) {
                            this.moveBlock(row, nextCol, row, col)
                            if (flag == 0) flag = 1
                        }
                        else {
                            nextCol++
                        }
                    } else {
                        if (num2 == 0) {
                            nextCol++
                        } else if (num2 == num1) {
                            this.mergeBlock(row, nextCol, row, col)
                            flag = 2
                            break
                        } else {
                            break
                        }
                    }
                }

            }
        }
        this.afterMove(flag)
    }

    moveUp() {
        let flag = 0
        for (let col = 0; col < blockNum; col++) {
            for (let row = blockNum - 1; row > 0; row--) {
                let nextRow = row - 1
                while (nextRow >= 0) {
                    let num1 = this.numbers[row][col]
                    let num2 = this.numbers[nextRow][col]
                    if (num1 == 0) {
                        if (num2 != 0) {
                            this.moveBlock(nextRow, col, row, col)
                            if (flag == 0) flag = 1
                        }
                        else {
                            nextRow--
                        }
                    } else {
                        if (num2 == 0) {
                            nextRow--
                        } else if (num2 == num1) {
                            this.mergeBlock(nextRow, col, row, col)
                            flag = 2
                            break
                        } else {
                            break
                        }
                    }
                }

            }
        }
        this.afterMove(flag)
    }

    moveDown() {
        let flag = 0 //0:无变化 1:移动  2:合并
        for (let col = 0; col < blockNum; col++) {
            for (let row = 0; row < blockNum - 1; row++) {
                let nextRow = row + 1
                while (nextRow < blockNum) {
                    let num1 = this.numbers[row][col]
                    let num2 = this.numbers[nextRow][col]
                    if (num1 == 0) {
                        if (num2 != 0) {
                            this.moveBlock(nextRow, col, row, col)
                            if (flag == 0) flag = 1
                        }
                        else {
                            nextRow++
                        }
                    } else {
                        if (num2 == 0) {
                            nextRow++
                        } else if (num2 == num1) {
                            this.mergeBlock(nextRow, col, row, col)
                            flag = 2
                            break
                        } else {
                            break
                        }
                    }
                }

            }
        }
        this.afterMove(flag)

    }

    //方块移动
    moveBlock(row1, col1, row2, col2) {
        this.numbers[row2][col2] = this.numbers[row1][col1]
        this.numbers[row1][col1] = 0
        this.blocks[row2][col2] = this.blocks[row1][col1]
        this.blocks[row1][col1] = null
        //缓动（动画）
        tween(this.blocks[row2][col2]).to(MOVE_DAURATION, { position: this.positions[row2][col2] }).start()
    }

    //方块合并
    mergeBlock(row1, col1, row2, col2) {
        this.numbers[row2][col2] *= 2
        this.numbers[row1][col1] = 0
        this.blocks[row1][col1].destroy()
        this.blocks[row1][col1] = null
        this.blocks[row2][col2].getComponent(blockCtr).setNumber(this.numbers[row2][col2])
        //缩放动画
        tween(this.blocks[row2][col2])
            .to(0.2, { scale: new Vec3(1.2, 1.2, 1.2) })
            .to(0.2, { scale: new Vec3(1, 1, 1) })
            .start()
        this.updateScore(this.numbers[row2][col2])
    }

    // 得分
    updateScore(num) {
        this.score += num;
        if (this.score > this.best) {
            this.best = this.score;
            this._bestLb.getComponent(Label).string = this.best + "";
            oops.storage.set("best", this.best);
        }
        this._scoreLb.getComponent(Label).string = this.score + "";
    }

    //滑动操作之后
    afterMove(flag) {
        // 移动
        if (flag == 1) {
            oops.audio.playEffect("audios/move");
        }
        else if (flag == 2) {//合并
            oops.audio.playEffect("audios/merge");
        }
        if (flag > 0) {//有效滑动，产生新方块
            setTimeout(() => {
                this.randomBlock()
                if (this.checkFail()) {//游戏失败检查
                    this.gameover()
                }
            }, 500)
        }
    }

    checkFail() {
        for (let i = 0; i < blockNum; i++) {
            for (let j = 0; j < blockNum; j++) {
                let num = this.numbers[i][j]
                if (num == 0) return false
                if (i > 0 && this.numbers[i - 1][j] == num) return false
                if (i < blockNum - 1 && this.numbers[i + 1][j] == num) return false
                if (j > 0 && this.numbers[i][j - 1] == num) return false
                if (j < blockNum - 1 && this.numbers[i][j + 1] == num) return false
            }
        }
        return true
    }

    gameover() {
        let args = {
            score: this.score,
            best: this.best
        };
        oops.gui.open(UIID.GameOverUI, args);
    }

    private _setBlockSize(block: Node, blockSize: number) {
        // 设置方格大小
        block.getComponent(UITransform).width = blockSize;
        block.getComponent(UITransform).height = blockSize;
        let bg = block.getChildByName("bg")
        bg.getComponent(UITransform).width = blockSize;
        bg.getComponent(UITransform).height = blockSize;
    }

    // 空位置
    private _getEmptyPositions() {
        let pos = [];
        for (let i = 0; i < this.positions.length; i++) {
            for (let j = 0; j < this.positions[i].length; j++) {
                if (this.numbers[i][j] == 0) {
                    pos.push({ row: i, col: j });
                }
            }
        }
        return pos;
    }

    // 设置音乐开关状态
    private _setAudioState() {
        let bSwitch = oops.audio.switchEffect;
        this._audioBtn.active = bSwitch;
        this._muteBtn.active = !bSwitch;
    }

    // 界面适配
    private _resetLayout() {
        // 葡萄牙语的最佳会和数字重叠，在这里做下适配
        let lan = oops.storage.get("language");
        let x = lan == "pt" ? 180 : 140;
        this._bestLb.setPosition(x, this._bestLb.position.y, this._bestLb.position.z);
    }

    // 重新开始
    onClickRestart(event: Event, data: any) {
        this.init();
    }

    // 打开声音
    onClickAudioBtn(event: Event, data: any) {
        let bSwitch = data == "on" ? true : false;
        oops.audio.switchEffect = bSwitch;
        oops.audio.save();
        this._setAudioState();
    }

    // 打开设置界面
    onClickSettingBtn(event: Event, data: any) {
        oops.gui.open(UIID.SettingUI, {});
        // let webView = this.node.getChildByName('Node_View');
        // if (webView)
        //     webView.active = true;

    }

    // 添加全局消息事件
    private _addEvent() {
        oops.message.on(GameEvent.GameRestart, this.onHandler, this);
        oops.message.on(GameEvent.PlayEffect, this.onHandler, this);
    }

    // 移除全局消息事件
    private _removeEvent() {
        oops.message.off(GameEvent.GameRestart, this.onHandler, this);
        oops.message.off(GameEvent.PlayEffect, this.onHandler, this);
    }

    private onHandler(event: string, args: any) {
        switch (event) {
            case GameEvent.GameRestart:
                this.init();
                break;
            case GameEvent.PlayEffect:
                this._setAudioState();
                this._resetLayout();
                break;
        }
    }
}

