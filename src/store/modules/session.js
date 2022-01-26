import { setStore, getStore } from '@/util/store'
const session = {
	state: {
		dataType:0,
		loamAreaName:''
	},
	getters : {
	  //获取到用户状态,//实时监听state值的变化(最新状态)
	  loamAreaName: state => state.loamAreaName
	},	
	actions: {
		setLoamAreaName({ commit }, loamAreaName) {			
		    commit("SET_LOAM_AREA", loamAreaName);
		}        
	},
	mutations: {
		SET_LOAM_AREA:(state, loamAreaName)=> {
		    if (loamAreaName) {
		      state.loamAreaName = loamAreaName; //如果targetUser有内容就赋给状态信息
		    } else {
		      //如果没内容就给targetUser赋空对象
		      state.loamAreaName = '';
		    }
		},
        SET_ELEVATOR: (state) => {
            setStore({name: 'elevator',content: true})                        
        },
        SET_TOWER: (state) => {
            setStore({name: 'tower',content: true})                        
        },
        SET_UNLOADING: (state) => {
            setStore({name: 'unloading',content: true})                        
        },  
        SET_GISID: (state,{value}) => {
            setStore({name: 'swaqHistorydataSiteId',content: value})                        
        }, 
        SET_TPARAMS: (state,{value}) => {
            setStore({name: 'templateParams',content: value})                        
        },
        SET_AUDITTREEPARAMS: (state,{value}) => {
            setStore({name: 'auditTreeParams',content: value})                        
        }            
	}
};

export default session;