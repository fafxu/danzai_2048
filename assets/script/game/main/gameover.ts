import { _decorator, Component, Label, Node } from 'cc';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { GameEvent } from '../common/config/GameEvent';
const { ccclass, property } = _decorator;

@ccclass('gameover')
export class gameover extends Component {
    @property(Node)
    private title: Node = null;

    @property(Node)
    private btnName: Node = null;

    private _bestScore: Number = null;
    private _score: Number = null;

    onAdded(args: any) {
        console.log(args);
        this._bestScore = args.best;
        this._score = args.score;
        let end = this.node.getChildByName("end");
        end.getChildByName("score").getComponent(Label).string = this._score + "";
        end.getChildByName("best").getComponent(Label).string = oops.language.getLangByID("text_optimal") + ": " + this._bestScore;
        this.title.getComponent(Label).string = oops.language.getLangByID("text_gameover");
        this.btnName.getComponent(Label).string = oops.language.getLangByID("text_restart");
    }

    onClickRestart(event: Event, data: any) {
        oops.message.dispatchEvent(GameEvent.GameRestart);
        oops.gui.removeByNode(this.node);
    }
}

