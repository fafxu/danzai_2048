/*
 * 开始游戏界面 
 */

import { _decorator, Component, find, Label, Node, Toggle, UITransform, WebView } from 'cc';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { UIConfigData, UIID } from '../common/config/GameUIConfig';
import { url } from 'inspector';

const { ccclass, property } = _decorator;

@ccclass('start')
export class start extends Component {
    @property(Node)
    private roll_1: Node = null;

    @property(Node)
    private roll_1_2: Node = null;

    @property(Node)
    private roll_2: Node = null;

    @property(Node)
    private roll_2_2: Node = null;

    @property(Toggle)
    private cbAgree: Toggle = null;

    @property(Node)
    private lbNode: Node = null;

    private _bgSpeed = 60;
    private _bgMovingRange = 1190;

    start() {
        oops.audio.volumeEffect = 1;

        this.roll_1.setPosition(0, 136, 0);
        this.roll_1_2.setPosition(1190, 136, 0);

        this.roll_2.setPosition(0, -122, 0);
        this.roll_2_2.setPosition(-1190, -122, 0);
    }

    onLoad() {
        oops.audio.load();
        this.cbAgree.isChecked = oops.storage.getNumber("isAgreed") == 1;
        this.node.getChildByName("bg").getChildByName("frame").getChildByName("square").angle = 21;
    }

    update (deltaTime: number) {
        // 上滚动效果
        this.roll_1.setPosition(this.roll_1.position.x - this._bgSpeed * deltaTime, 136, 0);
        this.roll_1_2.setPosition(this.roll_1_2.position.x - this._bgSpeed * deltaTime, 136, 0);
        if (this.roll_1.position.x < -this._bgMovingRange) {
            this.roll_1.setPosition(this.roll_1_2.position.x + this._bgMovingRange, 136, 0);
        } else if (this.roll_1_2.position.x < -this._bgMovingRange) {
            this.roll_1_2.setPosition(this.roll_1.position.x + this._bgMovingRange, 136, 0);
        }
        // 下滚动效果
        this.roll_2.setPosition(this.roll_2.position.x + this._bgSpeed * deltaTime, -122, 0);
        this.roll_2_2.setPosition(this.roll_2_2.position.x + this._bgSpeed * deltaTime, -122, 0);
        if (this.roll_2.position.x > this._bgMovingRange) {
            this.roll_2.setPosition(this.roll_2_2.position.x - this._bgMovingRange, -122, 0);
        } else if (this.roll_2_2.position.x > this._bgMovingRange) {
            this.roll_2_2.setPosition(this.roll_2.position.x - this._bgMovingRange, -122, 0);
        }

        let lan = oops.storage.get("language");
        if (lan == "pt") {
            this.lbNode.setPosition(-20, this.lbNode.position.y, this.lbNode.position.z);
        } else if (lan == "en") {
            this.lbNode.setPosition(-50, this.lbNode.position.y, this.lbNode.position.z);
        }  
    }

    onClickBtnStart() {
        if (!this.cbAgree.isChecked) {
            oops.gui.toast(oops.language.getLangByID("text_reminder_to_read"));
            return;
        }
        oops.gui.open(UIID.MainUI);
        oops.gui.remove(UIID.Start);
    }

    onClickBtnProtocol(event: Event, data: any) {
        oops.gui.open(UIID.PrivateUI, {});
    }

    onClickCheckBoxAgree(toggle: Toggle, customEventData: any) {
        let bChecked = toggle.isChecked ? 1 : 0;
        oops.storage.set("isAgreed", bChecked);
    }
}

