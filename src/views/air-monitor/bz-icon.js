import fang1 from "@/assets/img/map/fang1.png";
import fang2 from "@/assets/img/map/fang2.png";
import fang3 from "@/assets/img/map/fang3.png";
import fang4 from "@/assets/img/map/fang4.png";
import fang5 from "@/assets/img/map/fang5.png";
import fang6 from "@/assets/img/map/fang6.png";
export function bz_getAQIColor(value) {
    if (value == "" || value == null || value < 0 || value == undefined) {
        return fang1;
    } else {
        var collectValue = parseFloat(value);
        if (collectValue >= 0 && collectValue <= 50) {
            return fang1;
        } else if (collectValue > 50 && collectValue <= 100) {
            return fang2;
        } else if (collectValue > 100 && collectValue <= 150) {
            return fang3;
        } else if (collectValue > 150 && collectValue <= 200) {
            return fang4;
        } else if (collectValue > 200 && collectValue <= 300) {
            return fang5;
        } else if (collectValue > 300) {
            return fang6;
        }
    }
}
export function bz_getPM2_5Color(value) {
    if (value == "" || value == null || value < 0 || value == undefined) {
        return fang1;
    } else {
        var collectValue = parseFloat(value);
        if (collectValue >= 0 && collectValue <= 35) {
            return fang1;
        } else if (collectValue > 35 && collectValue <= 75) {
            return fang2;
        } else if (collectValue > 75 && collectValue <= 115) {
            return fang3;
        } else if (collectValue > 115 && collectValue <= 150) {
            return fang4;
        } else if (collectValue > 150 && collectValue <= 250) {
            return fang5;
        } else if (collectValue > 250) {
            return fang6;
        }
    }
}
export function bz_getPM10Color(value) {
    if (value == "" || value == null || value < 0 || value == undefined) {
        return fang1;
    } else {
        var collectValue = parseFloat(value);
        if (collectValue >= 0 && collectValue <= 50) {
            return fang1;
        } else if (collectValue > 50 && collectValue <= 150) {
            return fang2;
        } else if (collectValue > 150 && collectValue <= 250) {
            return fang3;
        } else if (collectValue > 250 && collectValue <= 350) {
            return fang4;
        } else if (collectValue > 350 && collectValue <= 420) {
            return fang5;
        } else if (collectValue > 420) {
            return fang6;
        }
    }
}
export function bz_getSO2Color(value) {
    if (value == "" || value == null || value < 0 || value == undefined) {
        return fang1;
    } else {
        var collectValue = parseFloat(value);
        if (collectValue >= 0 && collectValue <= 50) {
            return fang1;
        } else if (collectValue > 50 && collectValue <= 150) {
            return fang2;
        } else if (collectValue > 150 && collectValue <= 475) {
            return fang3;
        } else if (collectValue > 475 && collectValue <= 800) {
            return fang4;
        } else if (collectValue > 800 && collectValue <= 1600) {
            return fang5;
        } else if (collectValue > 1600) {
            return fang6;
        }
    }
}
export function bz_getNO2Color(value) {
    if (value == "" || value == null || value < 0 || value == undefined) {
        return fang1;
    } else {
        var collectValue = parseFloat(value);
        if (collectValue >= 0 && collectValue <= 40) {
            return fang1;
        } else if (collectValue > 40 && collectValue <= 80) {
            return fang2;
        } else if (collectValue > 80 && collectValue <= 180) {
            return fang3;
        } else if (collectValue > 180 && collectValue <= 280) {
            return fang4;
        } else if (collectValue > 280 && collectValue <= 565) {
            return fang5;
        } else if (collectValue > 565) {
            return fang6;
        }
    }
}
export function bz_getCOColor(value) {
    if (value == "" || value == null || value < 0 || value == undefined) {
        return fang1;
    } else {
        var collectValue = parseFloat(value);
        if (collectValue >= 0 && collectValue <= 2) {
            return fang1;
        } else if (collectValue > 2 && collectValue <= 4) {
            return fang2;
        } else if (collectValue > 4 && collectValue <= 14) {
            return fang3;
        } else if (collectValue > 14 && collectValue <= 24) {
            return fang4;
        } else if (collectValue > 24 && collectValue <= 36) {
            return fang5;
        } else if (collectValue > 36) {
            return fang6;
        }
    }
}
export function bz_getO3Color(value) {
    if (value == "" || value == null || value < 0 || value == undefined) {
        return fang1;
    } else {
        var collectValue = parseFloat(value);
        if (collectValue >= 0 && collectValue <= 100) {
            return fang1;
        } else if (collectValue > 100 && collectValue <= 160) {
            return fang2;
        } else if (collectValue > 160 && collectValue <= 215) {
            return fang3;
        } else if (collectValue > 215 && collectValue <= 265) {
            return fang4;
        } else if (collectValue > 265 && collectValue <= 800) {
            return fang5;
        } else if (collectValue > 800) {
            return fang6;
        }
    }
}
export function bz_getTVOCColor(value) {
    if (value == "" || value == null || value < 0 || value == undefined) {
        return fang1;
    } else {
        var collectValue = parseFloat(value);
        if (collectValue >= 0 && collectValue <= 125) {
            return fang1;
        } else if (collectValue > 125 && collectValue <= 250) {
            return fang2;
        } else if (collectValue > 250 && collectValue <= 375) {
            return fang3;
        } else if (collectValue > 375 && collectValue <= 500) {
            return fang4;
        } else if (collectValue > 500 && collectValue <= 625) {
            return fang5;
        } else if (collectValue > 625) {
            return fang6;
        }
    }
}
