
export function getAQIColor(value) {
    if (value == "" || value == null || value < 0 || value == undefined) {
        return "#a9a9a9";
    } else {
        var collectValue = parseFloat(value);
        if (collectValue >= 0 && collectValue <= 50) {
            return "rgb(0,228,0)";
        } else if (collectValue > 50 && collectValue <= 100) {
            return "rgb(255,255,0)";
        } else if (collectValue > 100 && collectValue <= 150) {
            return "rgb(255,126,0)";
        } else if (collectValue > 150 && collectValue <= 200) {
            return "rgb(255,0,0)";
        } else if (collectValue > 200 && collectValue <= 300) {
            return "rgb(153,0,76)";
        } else if (collectValue > 300) {
            return "rgb(126,0,35)";
        }
    }
}
export function getPM2_5Color(value) {
    if (value == "" || value == null || value < 0 || value == undefined) {
        return "#a9a9a9";
    } else {
        var collectValue = parseFloat(value);
        if (collectValue >= 0 && collectValue <= 35) {
            return "rgb(0,228,0)";
        } else if (collectValue > 35 && collectValue <= 75) {
            return "rgb(255,255,0)";
        } else if (collectValue > 75 && collectValue <= 115) {
            return "rgb(255,126,0)";
        } else if (collectValue > 115 && collectValue <= 150) {
            return "rgb(255,0,0)";
        } else if (collectValue > 150 && collectValue <= 250) {
            return "rgb(153,0,76)";
        } else if (collectValue > 250) {
            return "rgb(126,0,35)";
        }
    }
}
export function getPM10Color(value) {
    if (value == "" || value == null || value < 0 || value == undefined) {
        return "#a9a9a9";
    } else {
        var collectValue = parseFloat(value);
        if (collectValue >= 0 && collectValue <= 50) {
            return "rgb(0,228,0)";
        } else if (collectValue > 50 && collectValue <= 150) {
            return "rgb(255,255,0)";
        } else if (collectValue > 150 && collectValue <= 250) {
            return "rgb(255,126,0)";
        } else if (collectValue > 250 && collectValue <= 350) {
            return "rgb(255,0,0)";
        } else if (collectValue > 350 && collectValue <= 420) {
            return "rgb(153,0,76)";
        } else if (collectValue > 420) {
            return "rgb(126,0,35)";
        }
    }
}
export function getSO2Color(value) {
    if (value == "" || value == null || value < 0 || value == undefined) {
        return "#a9a9a9";
    } else {
        var collectValue = parseFloat(value);
        if (collectValue >= 0 && collectValue <= 50) {
            return "rgb(0,228,0)";
        } else if (collectValue > 50 && collectValue <= 150) {
            return "rgb(255,255,0)";
        } else if (collectValue > 150 && collectValue <= 475) {
            return "rgb(255,126,0)";
        } else if (collectValue > 475 && collectValue <= 800) {
            return "rgb(255,0,0)";
        } else if (collectValue > 800 && collectValue <= 1600) {
            return "rgb(153,0,76)";
        } else if (collectValue > 1600) {
            return "rgb(126,0,35)";
        }
    }
}
export function getNO2Color(value) {
    if (value == "" || value == null || value < 0 || value == undefined) {
        return "#a9a9a9";
    } else {
        var collectValue = parseFloat(value);
        if (collectValue >= 0 && collectValue <= 40) {
            return "rgb(0,228,0)";
        } else if (collectValue > 40 && collectValue <= 80) {
            return "rgb(255,255,0)";
        } else if (collectValue > 80 && collectValue <= 180) {
            return "rgb(255,126,0)";
        } else if (collectValue > 180 && collectValue <= 280) {
            return "rgb(255,0,0)";
        } else if (collectValue > 280 && collectValue <= 565) {
            return "rgb(153,0,76)";
        } else if (collectValue > 565) {
            return "rgb(126,0,35)";
        }
    }
}
export function getCOColor(value) {
    if (value == "" || value == null || value < 0 || value == undefined) {
        return "#a9a9a9";
    } else {
        var collectValue = parseFloat(value);
        if (collectValue >= 0 && collectValue <= 2) {
            return "rgb(0,228,0)";
        } else if (collectValue > 2 && collectValue <= 4) {
            return "rgb(255,255,0)";
        } else if (collectValue > 4 && collectValue <= 14) {
            return "rgb(255,126,0)";
        } else if (collectValue > 14 && collectValue <= 24) {
            return "rgb(255,0,0)";
        } else if (collectValue > 24 && collectValue <= 36) {
            return "rgb(153,0,76)";
        } else if (collectValue > 36) {
            return "rgb(126,0,35)";
        }
    }
}
export function getO3Color(value) {
    if (value == "" || value == null || value < 0 || value == undefined) {
        return "#a9a9a9";
    } else {
        var collectValue = parseFloat(value);
        if (collectValue >= 0 && collectValue <= 100) {
            return "rgb(0,228,0)";
        } else if (collectValue > 100 && collectValue <= 160) {
            return "rgb(255,255,0)";
        } else if (collectValue > 160 && collectValue <= 215) {
            return "rgb(255,126,0)";
        } else if (collectValue > 215 && collectValue <= 265) {
            return "rgb(255,0,0)";
        } else if (collectValue > 265 && collectValue <= 800) {
            return "rgb(153,0,76)";
        } else if (collectValue > 800) {
            return "rgb(126,0,35)";
        }
    }
}
export function getTVOCColor(value) {
    if (value == "" || value == null || value < 0 || value == undefined) {
        return "#a9a9a9";
    } else {
        var collectValue = parseFloat(value);
        if (collectValue >= 0 && collectValue <= 125) {
            return "rgb(0,228,0)";
        } else if (collectValue > 125 && collectValue <= 250) {
            return "rgb(255,255,0)";
        } else if (collectValue > 250 && collectValue <= 375) {
            return "rgb(255,126,0)";
        } else if (collectValue > 375 && collectValue <= 500) {
            return "rgb(255,0,0)";
        } else if (collectValue > 500 && collectValue <= 625) {
            return "rgb(153,0,76)";
        } else if (collectValue > 625) {
            return "rgb(126,0,35)";
        }
    }
}
