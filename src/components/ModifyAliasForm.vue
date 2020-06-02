<template>
  <div>
    <MenuItem name="modify-alias" @click.native="handleClkModifyAlias"
              ref="MenuItem" >
      <div v-if="aliasInfoOld.using_alias">
        修改别名
        <Icon type="md-git-commit" />
      </div>
      <div v-else>
        使用别名
        <Icon type="md-git-commit" />
      </div>
    </MenuItem>
    <Modal
      v-model="aliasFormModal"
      title="Modify Alias"
      @on-ok="ok"
      @on-cancel="cancel"
      @keydown.native.stop>
      <p>修改文献别名（将同步到文献管理中）</p>
      <Input v-model="nodeInfo.alias" placeholder="Enter something..." style="width: 300px" />
      <p>是否在改节点使用文献别名</p>
      <Checkbox v-model="nodeInfo.using_alias">使用文献别名</Checkbox>
    </Modal>
  </div>
</template>
<script>
export default {
  name: 'AddNodeForm',
  props: ['aliasInfoOld'],
  data() {
    return {
      aliasFormModal: false,
      nodeInfo: {
        alias: this.aliasInfoOld.alias,
        using_alias: this.aliasInfoOld.using_alias,
      },
    };
  },
  methods: {
    ok() {
      this.$Message.info('Alias modified');
      this.$emit('alias-modified', this.nodeInfo);
    },
    cancel() {
      //  this.$Message.info('Clicked cancel');
    },
    handleClkModifyAlias() {
      this.aliasFormModal = true;
      this.nodeInfo.alias = this.aliasInfoOld.alias;
      this.nodeInfo.using_alias = this.aliasInfoOld.using_alias;
      this.$Message.info('handleClk');
    },
  },
};
</script>
