const Option = {
    taskType: {
        Dichuyen: 1,
        Tamdung: 2,
        Dunglai: 3,
        Mosac: 4,
        Ngatsac: 5
    },
    StartConfirm: {
        Khong: 0,
        Kichhoat: 1
    },
    FinishConfirm: {
        Khong: 0,
        Kichhoat: 1
    },
    runStationFlag: {
        SDbando: 0,
        Tucauhinh: 1,
        Chieucauhinh: 2
    },
    ActionSource: {
        Tucauhinh: 0,
        Macdinh: 251,
        Tubenngoai: 252
    },
    Param20: {
        Nangtructiep: 0,
        Xoaytheogoc: 1,
        Sudungvitrixe: 2,
        Qrtinhchinh: 3,
        Setuptuweb: 4
    },
    Param21: {
        Dinhvidochinhxac: 0,
        Luiroitiendedinhvi: 1,
        Tienroiluidedinhvi: 2
    },
    Param30: {
        Nangtructiep: 0,
        Xoaytheogoc: 1,
        Sudungvitrixe: 2,
        Qrtinhchinh: 3,
        Setuptuweb: 4
    },
    Param31: {
        Dinhvidochinhxac: 0,
        Luiroitiendedinhvi: 1,
        Tienroiluidedinhvi: 2
    }
};

module.exports = {
    taskType:Option.taskType,
    StartConfirm:Option.StartConfirm,
    FinishConfirm:Option.FinishConfirm,
    runStationFlag:Option.runStationFlag,
    ActionSource:Option.ActionSource,
    Param20:Option.Param20,
    Param21:Option.Param21,
    Param30:Option.Param30,
    Param31:Option.Param31
};
