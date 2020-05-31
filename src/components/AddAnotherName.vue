<template>
  <div>
    <MenuItem name="add-another-coloer" @click.native="handleClkModifyColor" ref="MenuItem">
      添加别名
      <Icon type="ios-bookmark" />
    </MenuItem>
    <Modal
      v-model="anotherNameModal"
      title="添加别名"
      @on-ok="ok"
      @on-cancel="cancel"
      @keydown.native.stop>
      <Input v-model="nameInfo" placeholder="Enter something..." style="width: 300px" />
    </Modal>
  </div>
</template>
<script>
export default {
  name: 'AddAnotherName',
  props: ['name'],
  data() {
    return {
      anotherNameModal: false,
      nameInfo: this.name,
    };
  },
  methods: {
    ok() {
      this.$Message.info('Another Name added');
      this.$emit('another-name-added', this.nameInfo);
    },
    cancel() {
      //  this.$Message.info('Clicked cancel');
    },
    handleClkModifyColor() {
      this.nameInfo = this.name;
      this.anotherNameModal = true;
      this.$Message.info('handleClk');
    },
  },
};
</script>
