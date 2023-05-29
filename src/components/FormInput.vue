<template>
    <div :class="`w-100 ${!nomargins ? 'mt-3 mb-4' : ''}`">
        <label :for="id" class="text-white mb-2" v-if="!nolabel">
            <slot name="label">
                {{ label }}
            </slot>
        </label>
        <input class="form-control" :class="[`form-control-${size}`, {'form-control-plaintext': readonly}]" :type="type"
            :id="id" :value="modelValue" :placeholder="placeholder"
            @input="$emit('update:modelValue', $event.target.value)" @focus="$emit('focus', $event)"
            :readonly="readonly" />
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
defineProps({
    type: {
        type: String,
        required: false,
        default: "text",
    },
    id: {
        type: String,
        required: false,
        default: ""
    },
    label: {
        type: String,
        required: false,
        default: ""
    },
    modelValue: {
        type: String,
        required: false,
        default: "",
    },
    nolabel: {
        type: Boolean,
        required: false,
        default: false
    },
    placeholder: {
        type: String,
        required: false,
        default: ""
    },
    size: {
        type: String,
        required: false,
        default: "lg",
    },
    readonly: {
        type: Boolean,
        required: false,
        default: false,
    },
    nomargins: {
        type: Boolean,
        required: false,
        default: false,
    }
})

defineEmits(['update:modelValue', 'focus'])
</script>

<style scoped lang="sass">
$form-control-placeholder-color: #bbb
$form-control-focus-color: #e6e6e6
$form-control-focus-background-color: #141414

.form-control
    &, &.form-control-plaintext
        background-color: var(--main-background-color)
        border-color: var(--main-border-color)
        color: var(--color-gray)
    &.form-control-plaintext
        padding: 0.375rem 0.75rem
        border-width: 1px
    &:focus
        color: #{$form-control-focus-color}
        background-color: #{$form-control-focus-background-color}
        box-shadow: none
    &::-webkit-input-placeholder
        color: #{$form-control-placeholder-color}
</style>
