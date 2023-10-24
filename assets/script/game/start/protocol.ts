
import { _decorator, Component, WebView } from 'cc';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
const { ccclass, property } = _decorator;

@ccclass('protocol')
export class protocol extends Component {

    @property(WebView)
    private webview: WebView = null;

    onAdded(args: any) {
        
    }

    onClickClose(event: Event, data: any) {
        oops.gui.removeByNode(this.node);
    }
}

