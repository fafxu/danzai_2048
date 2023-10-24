import { _decorator, Component, Label, Node } from 'cc';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { SwitchController } from '../common/buttonEx/SwitchController';
import { GameEvent } from '../common/config/GameEvent';
const { ccclass, property } = _decorator;

@ccclass('setting')
export class setting extends Component {
    @property(SwitchController)
    private audioSwitch: SwitchController = null;

    @property(Node)
    private selectList: Node = null;

    @property(Node)
    private lbCurLang: Node = null;

    private _isOpen: boolean = false;
    private _curLan: string = null;

    onAdded(args: any) {
        this._curLan = oops.storage.get("language");
        this.lbCurLang.getComponent(Label).string = oops.language.getLangByID("text_current_language");
    }

    _showSelectList() {
        this._isOpen = !this._isOpen;
        this.selectList.active = this._isOpen;
    }

    onClickSave(event: Event, data: any) {
        // 设置音乐开关
        let bSwitch = this.audioSwitch.getSwitchFlag();
        oops.audio.switchEffect = bSwitch;
        oops.audio.save();
        oops.storage.set("language", this._curLan);
        // 设置当前语音
        oops.language.setLanguage(this._curLan, () => {
            oops.message.dispatchEvent(GameEvent.PlayEffect);
            // 关闭界面
            oops.gui.removeByNode(this.node);
        });
    }

    onClickSelectLanguage(event: Event, data: any) {
        this._curLan = data;
        // 设置语言显示
        let tmp = "text_language_Chinese";
        switch (data) {
            case "en":
                tmp = "text_language_English";
                break;
            case "pt":
                tmp = "text_language_Portuguese";
                break;
            default:
                break;
        }
        this.lbCurLang.getComponent(Label).string = oops.language.getLangByID(tmp);
        // 收起语言选择列表
        this._showSelectList();
    }

    onClickLanguage(event: Event, data: any) {
        this._showSelectList();
    }

    onClickClose(event: Event, data: any) {
        oops.gui.removeByNode(this.node);
    }
}

