import { _decorator, Component, Node, tween, Vec3, UITransform } from 'cc';
import { oops } from '../../../../../extensions/oops-plugin-framework/assets/core/Oops';
const { ccclass, property } = _decorator;

@ccclass('SwitchController')
export class SwitchController extends Component {
    @property(Node)
    SwitchButton:Node = null;

    @property(Node)
    Off:Node = null;

    @property(Node)
    On:Node = null;

    @property(Boolean)
    switchFlag:Boolean = true;

    radius = 0;
    radiusSwitch = 0;

    onLoad() {
        this.radius = this.SwitchButton.getComponent(UITransform).contentSize.width;
        this.radiusSwitch = this.SwitchButton.getComponent(UITransform).contentSize.width/2;

        this.setSwitchFlag(oops.audio.switchEffect);

        this.SwitchButton.on(Node.EventType.TOUCH_END,()=>{
            this.switchFlag = !this.switchFlag;      
            this.switchHandle();
        })
    }

    switchHandle() {
        let time = 0.3;
        if (!this.switchFlag) {
            tween(this.Off)
                .to(time, {position: new Vec3(this.SwitchButton.position.x, this.Off.position.y, 10)})
                .start();

            tween(this.On)
                .to(time, {position: new Vec3(this.radius, this.On.position.y, 0)})
                .start();
        } else {
            tween(this.On)
                .to(time, {position: new Vec3(this.SwitchButton.position.x, this.On.position.y, 10)})
                .start();
            
            tween(this.Off)
                .to(time, {position: new Vec3(-this.radius, this.Off.position.y, 0)})
                .start()
        }
    }

    getSwitchFlag() {
        return this.switchFlag as boolean;
    }

    setSwitchFlag(bo) {
        this.switchFlag = bo;
        if (bo) {
            this.On.setPosition(this.SwitchButton.position.x, this.On.position.y, 10);
            this.Off.setPosition(-this.radius, this.Off.position.y, 0);
        } else {
            this.Off.setPosition(this.SwitchButton.position.x, this.Off.position.y, 10);
            this.On.setPosition(this.radius, this.On.position.y, 0);
        }
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}

