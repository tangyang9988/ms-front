<template>
	<gis :mapType='mapType'></gis>
</template>

<script>
	import gis from "@/components/common/gis";
	export default {
		components: {
			gis
		},
		data() {
			return {
               mapType:1
			};
		},
		mounted() {},
		methods: {

		}
	}
</script>