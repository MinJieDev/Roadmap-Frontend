<template>
  <div>
    <MenuItem name="modify-color" @click.native="handleClkModifyColor" ref="MenuItem">
      更改颜色
      <Icon type="ios-color-palette" />
    </MenuItem>
    <Modal
      v-model="colorModal"
      title="选择颜色"
      @on-ok="ok"
      @on-cancel="cancel"
      @keydown.native.stop>
      <ColorPicker v-model="colorInfo" recommend :hue="false"/>
    </Modal>
  </div>
</template>
<script>
export default {
  name: 'ModifyColor',
  props: ['color'],
  data() {
    return {
      colorModal: false,
      colorInfo: this.color,
    };
  },
  methods: {
    ok() {
      this.$Message.info('Color modified');
      this.$emit('color-modified', this.colorInfo);
    },
    cancel() {
      //  this.$Message.info('Clicked cancel');
    },
    handleClkModifyColor() {
      this.colorInfo = this.color;
      this.colorModal = true;
      this.$Message.info('handleClk');
    },
  },
};
</script>
