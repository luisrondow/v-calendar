import { UnwrapNestedRefs, ComponentPublicInstance, h } from 'vue';
import { mount, VueWrapper } from '@vue/test-utils';
import { DatePickerContext } from '@/use/datePicker';
import DatePicker from '@/components/DatePicker/DatePicker.vue';

export type DatePickerComponent = UnwrapNestedRefs<DatePickerContext> &
  ComponentPublicInstance;

export async function mountDp(props: any, slots?: any) {
  const dpWrapper = mount<DatePickerComponent>(
    // @ts-ignore
    DatePicker,
    { props, slots },
  );
  return dpWrapper;
}

export function getDayClass(vm: DatePickerComponent, date: Date) {
  return `.id-${vm.locale.getDayId(date)}`;
}

export function getDayContentClass(vm: DatePickerComponent, date: Date) {
  return `${getDayClass(vm, date)} .vc-day-content`;
}

export function renderFnEvents(evts: Record<string, Function>) {
  const result: Record<string, Function> = {};
  Object.entries(evts).forEach(([evtName, evtFunction]) => {
    result[`on${evtName.charAt(0).toUpperCase() + evtName.slice(1)}`] =
      evtFunction;
  });
  return result;
}

export function mountWithInputs(props: any) {
  return mountDp(
    {
      ...props,
      timezone: 'utc',
    },
    {
      default: function (sProps: any) {
        if (props.isRange) {
          return h('div', [
            h('input', {
              props: {
                modelValue: sProps.inputValue.start,
              },
              ...renderFnEvents(sProps.inputEvents.start),
            }),
            h('input', {
              props: {
                modelValue: sProps.inputValue.end,
              },
              ...renderFnEvents(sProps.inputEvents.end),
            }),
          ]);
        }
        return h('input', {
          props: {
            modelValue: sProps.inputValue,
          },
          ...renderFnEvents(sProps.inputEvents),
        });
      },
    },
  );
}

export async function updateInputs(
  dp: VueWrapper<DatePickerComponent>,
  startValue: string,
  endValue?: string,
) {
  const inputs = dp.findAll('input');
  if (startValue != null) {
    await inputs[0].setValue(startValue);
    await inputs[0].trigger('change');
  }
  if (endValue != null) {
    await inputs[1].setValue(endValue);
    await inputs[1].trigger('change');
  }
}
