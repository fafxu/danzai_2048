/*
 * 数字方块控制器
 */

import { _decorator, Color, Component, Label, LabelOutline, Node, resources, Sprite, SpriteFrame } from 'cc';
import { BlockInfo } from '../common/config/GameUIConfig';
import { url } from 'inspector';
const { ccclass, property } = _decorator;

@ccclass('blockCtr')
export class blockCtr extends Component {
    private _bg: Node = null;
    private _num: Node = null;

    @property(SpriteFrame)
    private img_2: SpriteFrame = null;

    @property(SpriteFrame)
    private img_4: SpriteFrame = null;

    @property(SpriteFrame)
    private img_8: SpriteFrame = null;

    @property(SpriteFrame)
    private img_16: SpriteFrame = null;

    @property(SpriteFrame)
    private img_32: SpriteFrame = null;

    @property(SpriteFrame)
    private img_64: SpriteFrame = null;

    @property(SpriteFrame)
    private img_128: SpriteFrame = null;

    @property(SpriteFrame)
    private img_256: SpriteFrame = null;

    @property(SpriteFrame)
    private img_512: SpriteFrame = null;

    @property(SpriteFrame)
    private img_1024: SpriteFrame = null;

    @property(SpriteFrame)
    private img_2048: SpriteFrame = null;

    @property(SpriteFrame)
    private img_4096: SpriteFrame = null;

    @property(SpriteFrame)
    private img_8192: SpriteFrame = null;

    @property(SpriteFrame)
    private img_16384: SpriteFrame = null;

    @property(SpriteFrame)
    private img_32768: SpriteFrame = null;

    @property(SpriteFrame)
    private img_65536: SpriteFrame = null;

    @property(SpriteFrame)
    private img_131072: SpriteFrame = null;

    onLoad() {
        this._bg = this.node.getChildByName("bg");
        this._num = this.node.getChildByName("num");
    }

    setNumber(num) {
        // 空方块隐藏数字
        if (num == 0) {
            this._num.active = false;
            return;
        }
        // 字体大小
        let fontSize = 40;
        let outlineColor = new Color(0,0,0,255);
        if (BlockInfo[num]) {
            fontSize = BlockInfo[num].fontSize;
            outlineColor = BlockInfo[num].outlineColor;
        }
        //设置方块数字及字体大小
        this._num.getComponent(Label).string = num + "";
        this._num.getComponent(Label).fontSize = fontSize; 
        this._num.getComponent(LabelOutline).color = outlineColor;
        // 设置方块背景颜色
        this._bg.getComponent(Sprite).spriteFrame = this["img_" + num];
    }
}

