import { h } from 'vue'
import type { VNodeChild } from 'vue'
import { NTag } from 'naive-ui'
import type { SelectOption } from 'naive-ui'

export function renderTag (props: { option: SelectOption, handleClose: () => void }): VNodeChild {
    const layer = props.option.layer as number  % 5 
    const type = TagType[layer]
    return h(
        NTag,
        {
            ...props,
            type
        },
        ()=> props.option.label 
    )
} 
const TagType : Record<number, "default" | "error" | "primary" | "success" | "info" | "warning"> = {
    1 : 'error',
    2 : 'warning',
    3 : 'info',
    4 : 'success',
    0 : 'default'
}
    


