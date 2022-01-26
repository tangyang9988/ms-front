const $ = require('jquery')
const XLSX = require('xlsx')
/**
 * 获得列宽数组与表头最大层次
 * @param head
 * @return {{cols: Array, levels: number}}
 */
function getColsWidthAndLevel(head) {
  var defaultColWidth = { wpx: 200 };
  var cols = [];
  var levels = 1;//层次深度
  //最多三层
  for (var i in head) {
    if (!head[i].children) {
      if (head[i].excelWidth) {
        cols.push({ wpx: head[i].excelWidth });
      } else {
        cols.push(defaultColWidth);
      }
    } else if (head[i].children) {
      var childs = head[i].children;
      for (var j in childs) {//第二层
        if (levels === 1) {
          levels = 2;
        }
        if (!childs[j].children) {
          if (childs[j].excelWidth) {
            cols.push({ wpx: childs[j].excelWidth });
          } else {
            cols.push(defaultColWidth);
          }
        } else if (childs[j].children) {
          var childs1 = childs[j].children;//第三层
          for (var k in childs1) {
            if (levels === 2) {
              levels = 3;
            }
            if (!childs1[k].children && childs1[k].excelWidth) {
              cols.push({ wpx: childs1[k].excelWidth });
            } else {
              cols.push(defaultColWidth);
            }
          }
        }
      }
    }
  }
  // console.log('getColsWidthAndLevel',cols,levels);
  // getTmpData(levels,head);
  // console.log('头',head);
  return { cols: cols, levels: levels };
}
function fillHead(maxLevel, head) {
  for (let i=0;i<head.length;i++) {
    if (!head[i].children) {//一层的情况
      head[i].w = 1;//宽，一个单元格为一个单位
      head[i].h = maxLevel;//高，一个单元格为一个单位
      head[i].y = 1 + 1;//行索引
      if (i == 0) {
        head[i].x = 0;//列索引
      } else {
        head[i].x = head[i - 1].x + head[i - 1].w;
      }
    } else if (head[i].children) {//多层的情况
      head[i].y = 1 + 1;
      if (i == 0) {
        head[i].x = 0;
      } else {
        head[i].x = head[i - 1].x + head[i - 1].w;
      }
      head[i].w = 0;

      var childs = head[i].children;
      for (var j in childs) {
        if (!childs[j].children&&j!='unique'&&j!='getLastElement'&&j!='arrayMax') {//两层的情况
          head[i].w = head[i].w + 1;
          head[i].h = maxLevel > 2 ? 2 : 1;
          childs[j].w = 1;
          childs[j].h = 1;
          childs[j].y = maxLevel > 2 ? 3 + 1 : 2 + 1;
          childs[j].x = head[i].x + Number(j);
        } else if (childs[j].children) {//三层的情况
          head[i].h = 1;

          childs[j].w = childs[j].children.length;
          childs[j].h = 1;
          childs[j].y = 2 + 1;
          childs[j].x = head[i].x + Number(j) * childs.length;

          var childs1 = childs[j].children;
          for (var k in childs1) {//第三层
            head[i].w = head[i].w + 1;

            childs1[k].x = childs[j].x + Number(k);
            childs1[k].w = 1;
            childs1[k].h = 1;
            childs1[k].y = 3 + 1;
          }
        }
      }
    }
  }
  // console.log('fillHead',head);
}

function getExcelData(title, maxLevel, head, body, colsSize) {
  var tmpdata = {};
  var merges = [];
  fillHead(maxLevel, head);
  var keyCellMap = fillTmpdata(title, tmpdata, head, merges, colsSize);
  fillTmpdataBody(tmpdata, body, keyCellMap, maxLevel, merges, colsSize);
  //excel有个bug，部分列数据会出现不展示的情况，所以在最后一行的下一行给每个列赋值空
  for (var i = 0; i < colsSize; i++) {
    tmpdata[_getCharCol(i) + (body.length + 2 + maxLevel)] = { v: '' };
  }
  // console.log('getExcelData',tmpdata,merges);
  // console.log(JSON.stringify(tmpdata));
  // console.log('getExcelData 对比',_tmpdata,_merges);
  return { datas: tmpdata, merges: merges };
}
//填充头部数据与样式
function fillTmpdata(title, tmpdata, head, merges, colsSize) {
  //顶部标题
  var titleObj = {
    v: title, s: {
      alignment: { vertical: 'top', horizontal: 'center' },
      font: { sz: 20 }, fill: { fgColor: { rgb: 'cccccc' } }//666666 cccccc
    }
  };
  tmpdata['A1'] = titleObj;
  merges.push({
    s: {
      c: 0,
      r: 0
    },
    e: {
      c: colsSize - 1,
      r: 0
    }
  });

  var keyCellMap = {};
  for (var i in head) {
    setHeadTmpdata(head[i], tmpdata, keyCellMap, merges);
    var childs = head[i].children;
    for (var j in childs) {//第二层
      setHeadTmpdata(childs[j], tmpdata, keyCellMap, merges);
      if (childs[j].children) {
        var childs1 = childs[j].children;//第三层
        for (var k in childs1) {
          setHeadTmpdata(childs1[k], tmpdata, keyCellMap, merges);
        }
      }
    }
  }
  // console.log('fillTmpdata',head,deepCopy(tmpdata),merges,keyCellMap);
  return keyCellMap;
}

var borders = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };//
borders = {};
function setHeadTmpdata(childObj, tmpdata, keyCellMap, merges) {
  var obj3 = {
    v: childObj.label, s: {
      alignment: { vertical: 'top', horizontal: 'left' },
      font: { sz: 11, bold: true, color: { rgb: 'ffffff' } }, border: borders, fill: { fgColor: { rgb: '666666' } }//666666 cccccc
    }
  };
  if (childObj.w > 1 || childObj.h > 1) {
    // console.log('merges s c',childObj,childObj.x);
    merges.push({
      s: {
        c: childObj.x,
        r: childObj.y - 1
      },
      e: {
        c: childObj.x + childObj.w - 1,
        r: childObj.y - 2 + childObj.h
      }
    });
  }
  tmpdata[_getCharCol(childObj.x) + childObj.y] = obj3;

  // if (childObj.key) {
  //   keyCellMap[childObj.key] = _getCharCol(childObj.x);
  // }
  // // 判断表格头的key名是否叫id/key
  // if (childObj.id) {
  //   keyCellMap[childObj.id] = _getCharCol(childObj.x);
  // }
  // 判断表格头的key名是否叫prop
  if (childObj.prop) {
    keyCellMap[childObj.prop] = _getCharCol(childObj.x);
  }

}


// 将指定的自然数转换为26进制表示。映射关系：[0-25] -> [A-Z]。
function _getCharCol(n) {
  if (n < 26) {
    return String.fromCharCode(65 + n);
  } else {
    return String.fromCharCode(64 + parseInt(n / 25)) + String.fromCharCode(64 + n % 25);
  }
}
function fillTmpdataBody(tmpdata, body, keyCellMap, maxLevel, merges, colsSize) {
  for (var i in body) {
    var row = (maxLevel + Number(i) + 1 + 1);
    if (body[i].wholerow) {
      tmpdata['A' + row] = {
        v: body[i].value||body[i], s: {
          font: { sz: 11 }, border: borders
        }
      }
      if (body[i].fgColor)
        tmpdata['A' + row].s.fill = { fgColor: { rgb: body[i].fgColor } };
      if(body[i].color)
        tmpdata['A' + row].s.font.color= { rgb: body[i].color };
      merges.push({
        s: {
          c: 0,
          r: row - 1
        },
        e: {
          c: colsSize - 1,
          r: row - 1
        }
      });
    } else {
      for (var key in body[i]) {
        // let bodyVal = ''; // 判断是否有value
        if (!keyCellMap[key])
          continue;
        tmpdata[keyCellMap[key] + row] = {
          v: body[i][key].value||body[i][key], s: {
            font: { sz: 11 }, border: borders
          }
        }
        if (body[i][key].fgColor)
          tmpdata[keyCellMap[key] + row].s.fill = { fgColor: { rgb: body[i][key].fgColor } };
        if (keyCellMap[key] !== 'A') {
          tmpdata[keyCellMap[key] + row].s.alignment = { vertical: 'top', horizontal: 'right' };
        }
        if(body[i][key].color)
          tmpdata[keyCellMap[key] + row].s.font.color= { rgb: body[i][key].color };
      }
    }
  }
}


function _s2ab(s) { //字符串转字符流
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}

function _saveAs(obj, fileName) {//当然可以自定义简单的下载文件实现方式
  var tmpa = document.createElement("a");
  tmpa.download = fileName || "下载.xlsx";
  tmpa.href = URL.createObjectURL(obj); //绑定a标签
  tmpa.click(); //模拟点击实现下载
  setTimeout(function () { //延时释放
    URL.revokeObjectURL(obj); //用URL.revokeObjectURL()来释放这个object URL
  }, 100);
}

// var sheetName = 'sheet';
// var title = '测试排放口';
// var head = [{ key: 'point', name: '排口', excelWidth: 165 },
// {
//   name: 'SO2', children: [
//     { name: 'SO2实测值', children: [{ key: 'SO2实测值值', name: '值', excelWidth: 265 }, { key: 'SO2实测值状态', name: '状态' }] },
//     { name: 'SO2折算值', children: [{ key: 'SO2折算值值', name: '值' }, { key: 'SO2折算值状态', excelWidth: 365, name: '状态' }] }
//   ]
// },
// {
//   name: 'cod', children: [
//     { key: 'cod实测值状态', name: '值' },
//     { key: 'cod实测状态', name: '状态' }
//   ]
// }];

// var body = [
//   { value: '2017-08-17', wholerow: true, fgColor: 'cccccc',color:'cccccc' },
//   {
//     'point': { value: '无锡排口' }, 'SO2实测值值': { value: '5.88' },
//     'SO2实测值状态': { value: '正常' }, 'SO2折算值值': { value: '5.98' }, 'SO2折算值状态': { value: '异常' }, 'cod实测值状态': { value: '正常' }, 'cod实测状态': { value: '', fgColor: 'ec6149' }
//   },
// ];
/**
 * 一、表头部分
 * 数据类型为数组，每一个元素代表一个大列
 * frametree.js公共表头
 * 如果要调整列宽，需要在叶子节点（无children属性）上添加属性excelWidth
 *
 * 二、表体部分
 * 数据类型为数组，每一个元素代表一行记录
 * wholerow代表占用整行,如日期占用整行
 * fgColor代表单元格背景色
 * color代表单元格前景色

 *
 * @param sheetName sheet名称
 * @param title 标题名称
 * @param head 表头数据
 * @param body 表体数据
 * @param type 导出文件格式
 */
export function xlsxDownloadExl(sheetName, title, head, body, type) {
  $.each(body, (i, v) => {
    // 该段代码逻辑存在问题 导出值均为空 “”
    for (var key in v) {
      if(v[key] && v[key].hasOwnProperty("value")) {

        // v[key].hasOwnProperty('value') // 判断
        // if (v[key].value == null) {
        //   v[key].value = "";
        // }else if (typeof (v[key].value) == "number") {
        //   v[key].value = v[key].value.toString();
        // }

        v[key].value = v[key].value ? typeof (v[key].value) == "number" ? v[key].value = v[key].value.toString() : v[key].value : " "
      }else {
        v[key] = v[key] ? typeof (v[key]) == "number" ? v[key] = v[key].toString() : v[key] : " "
      }
      // for (var key in v) {
      //   if (v[key].hasOwnProperty('value')&&v[key].value == null) {
      //     v[key].value = "";
      //   }else if (typeof (v[key].value) == "number") {
      //     v[key].value = v[key].value.toString();
      //   }
      // }

    }
  })
  var colsObj = getColsWidthAndLevel(head);
  var cols = colsObj.cols;
  var maxlevel = colsObj.levels;
  var excelData = getExcelData(title, maxlevel, head, body, cols.length);
  var tmpdata = excelData.datas;
  // var tmpdata=_tmpdata;`1
  var merges = excelData.merges;
  
  // var tmpdata=_tmpdata;
  // var merges=_merges;
  //===============================================
  var outputPos = Object.keys(tmpdata);
  var tmpWB = {
    SheetNames: [sheetName], //保存的表标题
    Sheets: {}
  };
  //内容 '!rowBreaks':[1,1],/* '!cols': cols, '!merges':merges,
  // '!freeze':{ xSplit: "1", ySplit: "1", topLeftCell: "B2", activePane: "bottomRight", state: "frozen" }
  tmpWB.Sheets[sheetName] = Object.assign({},
    tmpdata,
    {
      '!cols': cols,
      '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1], //设置填充区域,
      '!merges': merges,
    });
  // console.log('主要数据对象',tmpWB);
  var tmpDown = new Blob([_s2ab(XLSX.write(tmpWB,
    { bookType: (type == undefined ? 'xlsx' : type), bookSST: true, showGridLines: true, type: 'binary' }//这里的数据是用来定义导出的格式类型
  ))], {
      type: ""
    }); //创建二进制对象写入转换好的字节流
  //添加时间
  var time = new Date();
  var dateHMS = time.getHours() + '-' + time.getMinutes() + '-' + time.getSeconds();
  title = title + " " + dateHMS;
  _saveAs(tmpDown, title + '.xlsx');

}

/*
*  merges = [{
        s: {c: 1, r: 0},
        e: {c: 3, r: 0}
      }];
       cols = [{wpx: 200}, {wpx: 200}, {wpx: 200}, {wpx: 200}];
* */

/**
 * 简单样式导出excel
 *  @param merges 数组类型需要合并的单元格
 * @param cols 数组类型需要设置的单元格宽度
 *@param isHiddenHead 是否隐藏表头 true为不展示表头
 */
export function downloadExl(title,json,merges,cols,isHiddenHead, type) {
  var tmpdata = json[0];

  !isHiddenHead&&json.unshift({});
  var keyMap = []; //获取keys
  for (var k in tmpdata) {
    keyMap.push(k);
    !isHiddenHead&&(json[0][k] = k);
  }
  tmpdata = [];//用来保存转换好的json
  json.map((v, i) => keyMap.map((k, j) => Object.assign({}, {
    v: v[k],
    position: (j > 25 ? _getCharCol(j) : String.fromCharCode(65 + j)) + (i + 1)
  }))).reduce((prev, next) => prev.concat(next)).forEach(v => tmpdata[v.position] = {
    v: v.v
  });
  var outputPos = Object.keys(tmpdata); //设置区域,比如表格从A1到D10
  //tmpdata["B1"].s = { font: { sz: 14, bold: true, color: { rgb: "FFFFAA00" } }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "FFFF00" } } };//<====设置xlsx单元格样式
  // tmpdata["!merges"] = [{
  //     s: { c: 3, r: 0 },
  //     e: { c: 4, r: 1 }
  //  }];//<====合并单元格
  tmpdata["!merges"] =merges;
  tmpdata['!cols']=cols;
  var tmpWB = {
    SheetNames: ['mySheet'], //保存的表标题
    Sheets: {
      'mySheet': Object.assign({},
        tmpdata, //内容
        {
          '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1] //设置填充区域
        })
    }
  };
  var tmpDown = new Blob([_s2ab(XLSX.write(tmpWB,
    { bookType: (type == undefined ? 'xlsx' : type), bookSST: false, type: 'binary' }//这里的数据是用来定义导出的格式类型
  ))], {
    type: ""
  });
  var time = new Date();
  var dateHMS = time.getHours() + '-' + time.getMinutes() + '-' + time.getSeconds();
  title = title + " " + dateHMS;
  _saveAs(tmpDown, title + '.xlsx');
}



// WEBPACK FOOTER //
// ./src/utils/exportExcel.js
