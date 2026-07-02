// FILE: src/app/dashboard/settings/page.tsx
'use client';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { validateInput } from '@/lib/validate';
import { z } from 'zod';
import { AppSettings } from '@/lib/types';
import { Input, Btn, Card } from '@/components/ui';

const settingsSchema = z.object({
  userName: z.string().min(1, 'Name is required'),
  userEmail: z.string().email('Invalid email address'),
  emailNotifications: z.boolean(),
  slackWebhooks: z.boolean(),
});

function SettingsPage() {
  const { state, dispatch } = useStore();
  const appSettings = state.settings || {};
  const [formData, setFormData] = useState(appSettings);
  const [errors, setErrors] = useState({} as Record<string, string>);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const validate = () => {
    try {
      settingsSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(Object.fromEntries(error.issues.map(issue => [issue.path.join('.'), issue.message])));
      }
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      dispatch({ type: 'SEED', payload: { appSettings: formData } });
      alert('Settings saved');
    }
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify({ appSettings }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'problemroot-settings.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          settingsSchema.parse(data.appSettings);
          dispatch({ type: 'SEED', payload: data });
          alert('Settings imported');
        } catch (error) {
          alert('Invalid file format');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset settings?')) {
      localStorage.clear();
      dispatch({ type: 'SEED' });
      alert('Settings reset');
    }
  };

  return (
    <div className="min-h-screen bg-page text-text">
      <Card>
        <h2 className="text-2xl mb-4">Settings</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="userName" className="block text-sm font-medium mb-1">Name</label>
            <Input
              type="text"
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className={errors.userName ? 'border-danger' : ''}
            />
            {errors.userName && <p className="text-danger text-sm mt-1">{errors.userName}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="userEmail" className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              id="userEmail"
              name="userEmail"
              value={formData.userEmail}
              onChange={handleChange}
              className={errors.userEmail ? 'border-danger' : ''}
            />
            {errors.userEmail && <p className="text-danger text-sm mt-1">{errors.userEmail}</p>}
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                id="emailNotifications"
                name="emailNotifications"
                checked={formData.emailNotifications}
                onChange={handleChange}
                className="mr-2"
              />
              Enable Email Notifications
            </label>
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                id="slackWebhooks"
                name="slackWebhooks"
                checked={formData.slackWebhooks}
                onChange={handleChange}
                className="mr-2"
              />
              Enable Slack Webhooks
            </label>
          </div>
          <Btn type="submit" className="mr-2">Save</Btn>
          <Btn onClick={handleExport} className="mr-2">Export</Btn>
          <Input type="file" accept=".json" onChange={handleImport} className="mr-2" />
          <Btn onClick={handleReset} className="btn-danger">Reset</Btn>
        </form>
      </Card>
    </div>
  );
}

export default SettingsPage;