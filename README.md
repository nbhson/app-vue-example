# Lifecycle hooks (Composition API)

[![CI](https://github.com/nbhson/app-vue-example/actions/workflows/ci.yml/badge.svg)](https://github.com/nbhson/app-vue-example/actions/workflows/ci.yml) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
```ts
import {
  defineComponent,
  ref,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted
} from 'vue';

export default defineComponent({
  name: 'LifecycleDemo',

  setup() {
    const count = ref(0);

    console.log('setup()');

    onBeforeMount(() => {
      console.log('beforeMount');
    });

    onMounted(() => {
      console.log('mounted');
    });

    onBeforeUpdate(() => {
      console.log('beforeUpdate');
    });

    onUpdated(() => {
      console.log('updated');
    });

    onBeforeUnmount(() => {
      console.log('beforeUnmount');
    });

    onUnmounted(() => {
      console.log('unmounted');
    });

    const increment = () => {
      count.value++;
    };

    return {
      count,
      increment
    };
  }
});

```