import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { applicationInfoSchema, ApplicationInfo } from './schema';
import { Form, FormControl, FormField, FormItem, FormLabel } from './components/form';
import { Input } from './components/input';

export default function App() {
  // 假设从服务器或 store 拿到初始值
  const initial: ApplicationInfo = {
    applicationSchool: '示例大学',
    applicationMajor: '示例专业',
  };

  const form = useForm<ApplicationInfo>({
    resolver: zodResolver(applicationInfoSchema),
    defaultValues: initial,
    mode: 'onChange',
  });
  // 订阅表单值变化（演示）
  useEffect(() => {
    const subscription = form.watch((value) => {
      console.log('form changed:', value);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = (data: ApplicationInfo) => {
    console.log('submit', data);
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <div style={{ padding: 24, maxWidth: 720 }}>
      <h2>示例：react-hook-form + Zod (FormField)</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="applicationSchool"
            render={({ field }) => (
              <FormItem>
                <FormLabel>报考院校</FormLabel>
                <FormControl>
                  <Input placeholder="例如：清华大学 / 北京大学" {...field} />
                  {form.formState.errors.applicationSchool && (
                    <p style={{ color: 'red', marginTop: 6 }}>
                      {String(form.formState.errors.applicationSchool.message)}
                    </p>
                  )}
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="applicationMajor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>报考专业</FormLabel>
                <FormControl>
                  <Input placeholder="例如：计算机科学与技术 / 软件工程" {...field} />
                  {form.formState.errors.applicationMajor && (
                    <p style={{ color: 'red', marginTop: 6 }}>
                      {String(form.formState.errors.applicationMajor.message)}
                    </p>
                  )}
                </FormControl>
              </FormItem>
            )}
          />

          <div style={{ marginTop: 12 }}>
            <button type="submit">提交</button>
            <button
              type="button"
              style={{ marginLeft: 8 }}
              onClick={() => {
                // 演示：从外部控制表单值
                form.setValue('applicationMajor', '软件工程', { shouldValidate: true });
              }}>
              设置专业为 软件工程
            </button>
            <button
              type="button"
              style={{ marginLeft: 8 }}
              onClick={() => {
                // 演示：重置表单（可能用于异步加载 default values）
                form.reset(initial);
              }}>
              Reset
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
}
