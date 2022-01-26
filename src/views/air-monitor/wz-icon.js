import yuan1 from "@/assets/img/map/yuan1.png";
import yuan2 from "@/assets/img/map/yuan2.png";
import yuan3 from "@/assets/img/map/yuan3.png";
import yuan4 from "@/assets/img/map/yuan4.png";
import yuan5 from "@/assets/img/map/yuan5.png";
import yuan6 from "@/assets/img/map/yuan6.png";
export function wz_getAQIColor(value) {
    if (value == "" || value == null || value < 0 || value == undefined) {
        return yuan1;
    } else {
        var collectValue = parseFloat(value);
        if (collectValue >= 0 && collectValue <= 50) {
            return yuan1;
        } else if (collectValue > 50 && collectValue <= 100) {
            return yuan2;
        } else if (collectValue > 100 && collectValue <= 150) {
            return yuan3;
        } else if (collectValue > 150 && collectValue <= 200) {
            return yuan4;
        } else if (collectValue > 200 && collectValue <= 300) {
            return yuan5;
        } else if (collectValue > 300) {
            return yuan6;
        }
    }
}
export function wz_getPM2_5Color(value) {
    if (value == "" || value == null || value < 0 || value == undefined) {
        return yuan1;
    } else {
        var collectValue = parseFloat(value);
        if (collectValue >= 0 && collectValue <= 35) {
            return yuan1;
        } else if (collectValue > 35 && collectValue <= 75) {
            return yuan2;
        } else if (collectValue > 75 && collectValue <= 115) {
            return yuan3;
        } else if (collectValue > 115 && collectValue <= 150) {
            return yuan4;
        } else if (collectValue > 150 && collectValue <= 250) {
            return yuan5;
        } else if (collectValue > 250) {
            return yuan6;
        }
    }
}
export function wz_getPM10Color(value) {
    if (value == "" || value == null || value < 0 || value == undefined) {
        return yuan1;
    } else {
        var collectValue = parseFloat(value);
        if (collectValue >= 0 && collectValue <= 50) {
            return yuan1;
        } else if (collectValue > 50 && collectValue <= 150) {
            return yuan2;
        } else if (collectValue > 150 && collectValue <= 250) {
            return yuan3;
        } else if (collectValue > 250 && collectValue <= 350) {
            return yuan4;
        } else if (collectValue > 350 && collectValue <= 420) {
            return yuan5;
        } else if (collectValue > 420) {
            return yuan6;
        }
    }
}
export function wz_getSO2Color(value) {
    if (value == "" || value == null || value < 0 || value == undefined) {
        return yuan1;
    } else {
        var collectValue = parseFloat(value);
        if (collectValue >= 0 && collectValue <= 50) {
            return yuan1;
        } else if (collectValue > 50 && collectValue <= 150) {
            return yuan2;
        } else if (collectValue > 150 && collectValue <= 475) {
            return yuan3;
        } else if (collectValue > 475 && collectValue <= 800) {
            return yuan4;
        } else if (collectValue > 800 && collectValue <= 1600) {
            return yuan5;
        } else if (collectValue > 1600) {
            return yuan6;
        }
    }
}
export function wz_getNO2Color(value) {
    if (value == "" || value == null || value < 0 || value == undefined) {
        return yuan1;
    } else {
        var collectValue = parseFloat(value);
        if (collectValue >= 0 && collectValue <= 40) {
            return yuan1;
        } else if (collectValue > 40 && collectValue <= 80) {
            return yuan2;
        } else if (collectValue > 80 && collectValue <= 180) {
            return yuan3;
        } else if (collectValue > 180 && collectValue <= 280) {
            return yuan4;
        } else if (collectValue > 280 && collectValue <= 565) {
            return yuan5;
        } else if (collectValue > 565) {
            return yuan6;
        }
    }
}
export function wz_getCOColor(value) {
    if (value == "" || value == null || value < 0 || value == undefined) {
        return yuan1;
    } else {
        var collectValue = parseFloat(value);
        if (collectValue >= 0 && collectValue <= 2) {
            return yuan1;
        } else if (collectValue > 2 && collectValue <= 4) {
            return yuan2;
        } else if (collectValue > 4 && collectValue <= 14) {
            return yuan3;
        } else if (collectValue > 14 && collectValue <= 24) {
            return yuan4;
        } else if (collectValue > 24 && collectValue <= 36) {
            return yuan5;
        } else if (collectValue > 36) {
            return yuan6;
        }
    }
}
export function wz_getO3Color(value) {
    if (value == "" || value == null || value < 0 || value == undefined) {
        return yuan1;
    } else {
        var collectValue = parseFloat(value);
        if (collectValue >= 0 && collectValue <= 100) {
            return yuan1;
        } else if (collectValue > 100 && collectValue <= 160) {
            return yuan2;
        } else if (collectValue > 160 && collectValue <= 215) {
            return yuan3;
        } else if (collectValue > 215 && collectValue <= 265) {
            return yuan4;
        } else if (collectValue > 265 && collectValue <= 800) {
            return yuan5;
        } else if (collectValue > 800) {
            return yuan6;
        }
    }
}
export function wz_getTVOCColor(value) {
    if (value == "" || value == null || value < 0 || value == undefined) {
        return yuan1;
    } else {
        var collectValue = parseFloat(value);
        if (collectValue >= 0 && collectValue <= 125) {
            return yuan1;
        } else if (collectValue > 125 && collectValue <= 250) {
            return yuan2;
        } else if (collectValue > 250 && collectValue <= 375) {
            return yuan3;
        } else if (collectValue > 375 && collectValue <= 500) {
            return yuan4;
        } else if (collectValue > 500 && collectValue <= 625) {
            return yuan5;
        } else if (collectValue > 625) {
            return yuan6;
        }
    }
}
