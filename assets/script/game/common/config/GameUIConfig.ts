/*
 * @Date: 2021-08-12 09:33:37
 * @LastEditors: dgflash
 * @LastEditTime: 2023-02-15 09:38:36
 */

import { Color } from "cc";
import { LayerType, UIConfig } from "../../../../../extensions/oops-plugin-framework/assets/core/gui/layer/LayerManager";

/** 界面唯一标识（方便服务器通过编号数据触发界面打开） */
export enum UIID {
    /** 资源加载界面 */
    Loading = 1,
    /** 弹窗界面 */
    Window,
    /** 加载与延时提示界面 */
    Netinstable,
    /** 开始游戏界面 */
    Start,
    /** 游戏住界面 */
    MainUI,
    /** 游戏结束界面 */
    GameOverUI,
    /** 游戏设置界面 */
    SettingUI,
    /** 隐私政策界面 */
    PrivateUI
}

/** 打开界面方式的配置数据 */
export var UIConfigData: { [key: number]: UIConfig } = {
    [UIID.Loading]: { layer: LayerType.UI, prefab: "gui/loading/loading" },
    [UIID.Netinstable]: { layer: LayerType.PopUp, prefab: "common/prefab/netinstable" },
    [UIID.Window]: { layer: LayerType.Dialog, prefab: "common/prefab/window" },
    [UIID.Start]: { layer: LayerType.UI, prefab: "gui/start/start" },
    [UIID.MainUI]: { layer: LayerType.UI, prefab: "gui/game/game" },
    [UIID.GameOverUI]: { layer: LayerType.PopUp, prefab: "gui/gameover/gameover" },
    [UIID.SettingUI]: { layer: LayerType.PopUp, prefab: "gui/setting/setting" },
    [UIID.PrivateUI]: { layer: LayerType.PopUp, prefab: "gui/start/private" },
}

export interface BlockConfig {
    // 数字大小
    fontSize : number,
    // 描边大小
    outlineColor : Color
}

// 数字方块颜色配置
export var BlockInfo : {[key : number] : BlockConfig } = {
    [0]: {fontSize: 72, outlineColor: new Color(0, 0, 0, 255)},
    [2]: {fontSize: 72, outlineColor: new Color(3, 196, 226, 255)},
    [4]: {fontSize: 72, outlineColor: new Color(4, 219, 140, 255)},
    [8]: {fontSize: 72, outlineColor: new Color(118, 136, 255, 255)},
    [16]: {fontSize: 60, outlineColor: new Color(214, 105, 252, 255)},
    [32]: {fontSize: 60, outlineColor: new Color(255, 165, 58, 255)},
    [64]: {fontSize: 60, outlineColor: new Color(255, 130, 46, 255)},
    [128]: {fontSize: 48, outlineColor: new Color(236, 85, 57, 255)},
    [256]: {fontSize: 48, outlineColor: new Color(26, 70, 179, 255)},
    [512]: {fontSize: 48, outlineColor: new Color(125, 201, 11, 255)},
    [1024]: {fontSize: 40, outlineColor: new Color(158, 10, 179, 255)},
    [2048]: {fontSize: 40, outlineColor: new Color(234, 122, 0, 255)},
    [4096]: {fontSize: 40, outlineColor: new Color(0, 81, 175, 255)},
    [8192]: {fontSize: 40, outlineColor: new Color(45, 158, 26, 255)},
    [16384]: {fontSize: 32, outlineColor: new Color(178, 107, 0, 255)},
    [32768]: {fontSize: 32, outlineColor: new Color(93, 0, 154, 255)},
    [65536]: {fontSize: 32, outlineColor: new Color(197, 0, 74, 255)},
    [131072]: {fontSize: 28, outlineColor: new Color(176, 0, 0, 255)}
}