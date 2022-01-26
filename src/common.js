import website from '@/config/website';
let options= {
    "$UploadUrl":"http://172.20.0.72:8080",
    "$tabelAlgin":'center',
    "website":website,
    "$pageSize":30,
    "$leftWidth":4,
    "$rightWidth":20,
    '$fontColor':'#F3FFFF',
    "$fontSize":'14px',
    "$len":5 // 少于6条时60秒刷新  多余6条时轮播形式 
}
export {
    options
}
