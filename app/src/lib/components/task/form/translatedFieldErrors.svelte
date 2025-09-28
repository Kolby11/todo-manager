<script lang="ts">
	import * as Form from 'formsnap';
	import { t } from 'svelte-i18n';

	let props: Form.FieldErrorsProps = $props()
</script>

<Form.FieldErrors {...props}>
	{#snippet children({ errors, errorProps })}
        {#each errors as err}
            <span style="color: red;" {...errorProps}>{$t(err)}</span>
        {/each}
    {/snippet}
</Form.FieldErrors>
