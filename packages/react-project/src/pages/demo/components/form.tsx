import React from 'react';
import {
  Controller,
  FieldPath,
  FieldValues,
  FormProvider,
  useController,
  UseControllerProps,
  UseFormReturn,
} from 'react-hook-form';

/**
 * 提供给外部的 Form 组件
 * 用法： <Form {...formMethods}><form>...</form></Form>
 * 它只是把 useForm 返回的 methods 注入到上下文（FormProvider）
 */
export function Form<TFormValues extends FieldValues>(props: React.PropsWithChildren<UseFormReturn<TFormValues>>) {
  const { children, ...methods } = props as any;
  return <FormProvider {...(methods as UseFormReturn<any>)}>{children}</FormProvider>;
}

/**
 * 简单的表单布局组件（容器）
 */
export function FormItem({ children }: { children: React.ReactNode }) {
  return <div style={{ marginBottom: 12 }}>{children}</div>;
}

export function FormLabel({ children }: { children: React.ReactNode }) {
  return <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>{children}</label>;
}

export function FormControl({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

/**
 * FormField：封装 useController，用法示例（你的写法）：
 * <FormField control={form.control} name="applicationMajor" render={({ field }) => <Input {...field} />} />
 */
type FormFieldRenderProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> = UseControllerProps<
  TFieldValues,
  TName
> & {
  render: (arg: {
    field: ReturnType<typeof useController>['field'];
    fieldState: any;
    formState: any;
  }) => React.ReactElement | null;
};

export function FormField<TFormValues extends FieldValues, TName extends FieldPath<TFormValues>>(
  props: FormFieldRenderProps<TFormValues, TName> & { control?: any; name: TName }
) {
  const { control, name, render } = props;
  // useController 会注册字段并返回 field、fieldState、formState
  const controller = useController({ name, control } as UseControllerProps<TFormValues, TName>);
  return render({ field: controller.field, fieldState: controller.fieldState, formState: controller.formState });
}
