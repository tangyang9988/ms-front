
export function title_getAQIColor(value) {
    if (value == "" || value == null || value < 0 || value == undefined) {
        return "my-div-title_1";
    } else {
        var collectValue = parseFloat(value);
        if (collectValue >= 0 && collectValue <= 50) {
            return "my-div-title_1";
        } else if (collectValue > 50 && collectValue <= 100) {
            return "my-div-title_2";
        } else if (collectValue > 100 && collectValue <= 150) {
            return "my-div-title_3";
        } else if (collectValue > 150 && collectValue <= 200) {
            return "my-div-title_4";
        } else if (collectValue > 200 && collectValue <= 300) {
            return "my-div-title_5";
        } else if (collectValue > 300) {
            return "my-div-title_6";
        }
    }
}
export function title_getPM2_5Color(value) {
    if (value == "" || value == null || value < 0 || value == undefined) {
        return "my-div-title_1";
    } else {
        var collectValue = parseFloat(value);
        if (collectValue >= 0 && collectValue <= 35) {
            return "my-div-title_1";
        } else if (collectValue > 35 && collectValue <= 75) {
            return "my-div-title_2";
        } else if (collectValue > 75 && collectValue <= 115) {
            return "my-div-title_3";
        } else if (collectValue > 115 && collectValue <= 150) {
            return "my-div-title_4";
        } else if (collectValue > 150 && collectValue <= 250) {
            return "my-div-title_5";
        } else if (collectValue > 250) {
            return "my-div-title_6";
        }
    }
}
export function title_getPM10Color(value) {
    if (value == "" || value == null || value < 0 || value == undefined) {
        return "my-div-title_1";
    } else {
        var collectValue = parseFloat(value);
        if (collectValue >= 0 && collectValue <= 50) {
            return "my-div-title_1";
        } else if (collectValue > 50 && collectValue <= 150) {
            return "my-div-title_2";
        } else if (collectValue > 150 && collectValue <= 250) {
            return "my-div-title_3";
        } else if (collectValue > 250 && collectValue <= 350) {
            return "my-div-title_4";
        } else if (collectValue > 350 && collectValue <= 420) {
            return "my-div-title_5";
        } else if (collectValue > 420) {
            return "my-div-title_6";
        }
    }
}
export function title_getSO2Color(value) {
    if (value == "" || value == null || value < 0 || value == undefined) {
        return "my-div-title_1";
    } else {
        var collectValue = parseFloat(value);
        if (collectValue >= 0 && collectValue <= 50) {
            return "my-div-title_1";
        } else if (collectValue > 50 && collectValue <= 150) {
            return "my-div-title_2";
        } else if (collectValue > 150 && collectValue <= 475) {
            return "my-div-title_3";
        } else if (collectValue > 475 && collectValue <= 800) {
            return "my-div-title_4";
        } else if (collectValue > 800 && collectValue <= 1600) {
            return "my-div-title_5";
        } else if (collectValue > 1600) {
            return "my-div-title_6";
        }
    }
}
export function title_getNO2Color(value) {
    if (value == "" || value == null || value < 0 || value == undefined) {
        return "my-div-title_1";
    } else {
        var collectValue = parseFloat(value);
        if (collectValue >= 0 && collectValue <= 40) {
            return "my-div-title_1";
        } else if (collectValue > 40 && collectValue <= 80) {
            return "my-div-title_2";
        } else if (collectValue > 80 && collectValue <= 180) {
            return "my-div-title_3";
        } else if (collectValue > 180 && collectValue <= 280) {
            return "my-div-title_4";
        } else if (collectValue > 280 && collectValue <= 565) {
            return "my-div-title_5";
        } else if (collectValue > 565) {
            return "my-div-title_6";
        }
    }
}
export function title_getCOColor(value) {
    if (value == "" || value == null || value < 0 || value == undefined) {
        return "my-div-title_1";
    } else {
        var collectValue = parseFloat(value);
        if (collectValue >= 0 && collectValue <= 2) {
            return "my-div-title_1";
        } else if (collectValue > 2 && collectValue <= 4) {
            return "my-div-title_2";
        } else if (collectValue > 4 && collectValue <= 14) {
            return "my-div-title_3";
        } else if (collectValue > 14 && collectValue <= 24) {
            return "my-div-title_4";
        } else if (collectValue > 24 && collectValue <= 36) {
            return "my-div-title_5";
        } else if (collectValue > 36) {
            return "my-div-title_6";
        }
    }
}
export function title_getO3Color(value) {
    if (value == "" || value == null || value < 0 || value == undefined) {
        return "my-div-title_1";
    } else {
        var collectValue = parseFloat(value);
        if (collectValue >= 0 && collectValue <= 100) {
            return "my-div-title_1";
        } else if (collectValue > 100 && collectValue <= 160) {
            return "my-div-title_2";
        } else if (collectValue > 160 && collectValue <= 215) {
            return "my-div-title_3";
        } else if (collectValue > 215 && collectValue <= 265) {
            return "my-div-title_4";
        } else if (collectValue > 265 && collectValue <= 800) {
            return "my-div-title_5";
        } else if (collectValue > 800) {
            return "my-div-title_6";
        }
    }
}
export function title_getTVOCColor(value) {
    if (value == "" || value == null || value < 0 || value == undefined) {
        return "my-div-title_1";
    } else {
        var collectValue = parseFloat(value);
        if (collectValue >= 0 && collectValue <= 125) {
            return "my-div-title_1";
        } else if (collectValue > 125 && collectValue <= 250) {
            return "my-div-title_2";
        } else if (collectValue > 250 && collectValue <= 375) {
            return "my-div-title_3";
        } else if (collectValue > 375 && collectValue <= 500) {
            return "my-div-title_4";
        } else if (collectValue > 500 && collectValue <= 625) {
            return "my-div-title_5";
        } else if (collectValue > 625) {
            return "my-div-title_6";
        }
    }
}
