<template>
    <Modal
      v-model="editDescriptionForm"
      title="Edit Description"
      @on-ok="ok"
      @on-cancel="cancel"
      @on-trig="handleTrig"
      @keydown.native.stop>
      <p>Description</p>
      <Input v-model="newDescription" type="textarea" placeholder="Enter Description..."/>
    </Modal>
</template>
<script>
export default {
  name: 'editDescriptionForm',
  props: ['description'],
  data() {
    return {
      editDescriptionForm: false,
      newDescription: '',
    };
  },
  methods: {
    ok() {
      this.$emit('description-edited', this.newDescription);
    },
    cancel() {
      //  this.$Message.info('Clicked cancel');
    },
    handleTrig() {
      this.newDescription = this.description;
      this.editDescriptionForm = true;
    },
  },
};
</script>
