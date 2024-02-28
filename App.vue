<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			console.log(uni.$u.config.v);
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	
	@import "@/uni_modules/uview-ui/index.scss";

</style>
