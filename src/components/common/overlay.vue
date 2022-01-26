<template>
  	<div>
		<div class="overlay" @click="changeTreeBox">
			<img src="/img/system/shou.png" alt="" class="overlay_img" v-if="status"/>
			<img src="/img/system/zhan.png" alt="" class="overlay_img" v-else/>
		</div>
    </div>	
</template>
<script>
	export default {
		data() {
			return { 
			   status:true
			}
		},	
		methods:{
            changeTreeBox(){
            	this.status=!this.status
            	this.$emit('changeTreeBox')
            }
		}
	}
</script>
<style lang="scss" scoped=""> 
.overlay {
	width: 12px;
	height: 300px;		
	position: absolute;
	z-index: 100;
	top: 50%;
	margin-top: -150px;
	left: 0;
}
.overlay_img{width: 12px;height: 300px;}
</style>