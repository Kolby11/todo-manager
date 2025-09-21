<script lang="ts">
	import { tv, type VariantProps } from 'tailwind-variants';

	type Option = {
		label: string;
		value: string;
	};

	const toggleSliderVariants = tv({
		base: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium outline-none transition-all focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
				destructive:
					'bg-destructive shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 text-white',
				outline:
					'bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 border',
				secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
				ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
				link: 'text-primary underline-offset-4 hover:underline'
			}
		},
		defaultVariants: {
			variant: 'default'
		}
	});

	type ToggleSliderVariant = VariantProps<typeof toggleSliderVariants>['variant'];

	type ToggleSliderProps = {
		options: Option[];
		value?: string;
		class?: string;
		variant?: ToggleSliderVariant;
	};

	let { options, value = $bindable('list'), class: className }: ToggleSliderProps = $props();

	let sliderStyle = $state('');

	let containerRef: HTMLDivElement;

	function handleOptionChange(v: string) {
		value = v;
		updateSliderPosition();
	}

	function updateSliderPosition() {
		if (!containerRef) return;

		const selectedElement = containerRef.querySelector(`[aria-checked="true"]`)
			?.parentElement as HTMLElement;

		if (selectedElement) {
			const containerRect = containerRef.getBoundingClientRect();
			const elementRect = selectedElement.getBoundingClientRect();

			const left = elementRect.left - containerRect.left;
			const width = elementRect.width;

			sliderStyle = `left: ${left - 2}px; width: ${width + 1}px;`;
		}
	}

	$effect(() => {
		if (containerRef) {
			requestAnimationFrame(() => {
				updateSliderPosition();
			});
		}
	});

	$effect(() => {
		if (containerRef) {
			updateSliderPosition();
		}
	});
</script>

<div
	bind:this={containerRef}
	class={`relative inline-flex rounded-md border-2 border-primary bg-background text-primary ${className}`}
>
	<!-- Sliding background -->
	<div
		class="rounded-m absolute inset-0 rounded-sm bg-primary transition-all duration-200 ease-in-out"
		style={sliderStyle}
	></div>

	{#each options as option}
		<label
			for={option.value}
			class={`z-20 block cursor-pointer px-4 py-2 text-sm font-medium duration-200 select-none ${value === option.value ? 'text-background' : ' text-primary'}`}
		>
			{option.label}
			<input
				type="radio"
				class="sr-only"
				id={option.value}
				value={option.value}
				aria-checked={value === option.value}
				bind:group={value}
				onchange={() => handleOptionChange(option.value)}
			/>
		</label>
	{/each}
</div>
