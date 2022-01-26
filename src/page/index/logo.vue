<template>
	<div class="avue-logo">
		<!--  	
    <transition name="fade">
      <span v-if="keyCollapse"
            class="avue-logo_subtitle"
            key="0">
        {{website.logo}}
      </span>
    </transition>
    <transition-group name="fade">
      <template v-if="!keyCollapse">
      	<div>
      		<img :src="systemPic" alt="" />
          <span class="avue-logo_title" style="font-size: 18px;" key="1">{{systemName}}</span>
        </div>
      </template>
    </transition-group>-->
		<img :src="systemPic" alt="" class="logoImg" v-if="systemPic"/>
		<span class="avue-logo_title systemName" :style="{'font-size':fontSize+'px'}" :class="{active:themeName=='theme-d2'}" v-if="!isCollapse">{{systemName}}</span>
	</div>
</template>

<script>
	import { mapGetters } from "vuex";
	import { getSystemConfig } from "@/api/ficm/systemName";
	export default {
		name: "logo",
		data() {
			return {
				systemName: '',
				systemPic: '',
				fontSize: 14,
			};
		},		
		computed: {
			...mapGetters(["website", "keyCollapse",'themeName','isCollapse'])
		},
		methods: {
			strLen(str) {
				var len = 0;
				for(var i = 0; i < str.length; i++) {
					var c = str.charCodeAt(i);
					//单字节加1
					if((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
						len++;
					} else {
						len += 2;
					}
				}
				return len;
			}
		},
		mounted() {			
			getSystemConfig().then(res => {
				this.systemName = res.data.data.systemName
				let len= this.strLen(this.systemName)
				if(len <=22) {
					this.fontSize = 18
				} else if(len <= 25) {
					this.fontSize = 16
				}else if(len <= 29){
					this.fontSize = 14
				}else{
					this.fontSize = 12
				}
				this.systemPic = res.data.data.systemPic
				this.website.indexTitle = res.data.data.systemName
			});
		},
	};
</script>

<style lang="scss">
	.fade-leave-active {
		transition: opacity 0.2s;
	}
	
	.fade-enter-active {
		transition: opacity 2.5s;
	}
	
	.fade-enter,
	.fade-leave-to {
		opacity: 0;
	}
	
	.avue-logo {
		display: flex;
		position: fixed;
		top: 0;
		left: 0;
		height: 64px;
		width: 240px;
		box-sizing: border-box;
		padding: 0 10px;
		align-items: center;
		justify-content: center;
	}
	
	.logoImg {
		width: 20px;
		height: 20px;
		display: block;
		margin-right: 8px;
	}
	
	.systemName {
		color: rgb(255, 255, 255);
		text-align: center;
		line-height: 1.6;
	}
	.systemName.active{
		color: #333;
	}
	/*.avue-logo {
  position: fixed;
  top: 0;
  left: 0;
  width: 240px;
  height: 64px;
  line-height: 64px;
  background-color: #20222a;
  font-size: 20px;
  overflow: hidden;
  box-sizing: border-box;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.15);
  color: rgba(255, 255, 255, 0.8);
  z-index: 1024;
  .avue-logo_title{
    font-size:18px;
  }
  &_title {
    display: block;
    text-align: center;
    font-weight: 300;
    font-size: 20px;
  }
  &_subtitle {
    display: block;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    color: #fff;
  }
}*/
</style>