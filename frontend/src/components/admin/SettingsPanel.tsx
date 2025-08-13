import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const SettingsPanel: React.FC = () => {
  const [backendUrl, setBackendUrl] = useState<string>("");
  const [frontendUrl, setFrontendUrl] = useState<string>("");
  const [emailFrom, setEmailFrom] = useState<string>("");
  const [language, setLanguage] = useState<string>("en");
  const [timezone, setTimezone] = useState<string>("Africa/Kigali");
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false);
  const [smsProviderEnabled, setSmsProviderEnabled] = useState<boolean>(false);
  const [emailProviderEnabled, setEmailProviderEnabled] = useState<boolean>(true);
  const [stripePublicKey, setStripePublicKey] = useState<string>("");
  const [stripeSecretKey, setStripeSecretKey] = useState<string>("");
  const [twilioSid, setTwilioSid] = useState<string>("");
  const [twilioAuth, setTwilioAuth] = useState<string>("");
  const [twilioFrom, setTwilioFrom] = useState<string>("");

  const saveSettings = () => {
    // Placeholder save - to be wired to /api/admin/settings later
    // eslint-disable-next-line no-alert
    alert('Settings saved (placeholder).');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600">Manage platform configuration</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Backend URL</Label>
            <Input placeholder="https://api.ndarehe.com" value={backendUrl} onChange={(e) => setBackendUrl(e.target.value)} />
          </div>
          <div>
            <Label>Frontend URL</Label>
            <Input placeholder="https://ndarehe.com" value={frontendUrl} onChange={(e) => setFrontendUrl(e.target.value)} />
          </div>
          <div>
            <Label>Email From</Label>
            <Input placeholder="NDAREHE <noreply@ndarehe.com>" value={emailFrom} onChange={(e) => setEmailFrom(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Timezone</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Africa/Kigali">Africa/Kigali</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center justify-between border rounded p-3">
            <div>
              <div className="font-medium">Maintenance Mode</div>
              <div className="text-xs text-gray-500">Temporarily disable public access</div>
            </div>
            <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
          </div>
          <Button onClick={saveSettings}>Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Stripe Public Key</Label>
              <Input placeholder="pk_live_..." value={stripePublicKey} onChange={(e) => setStripePublicKey(e.target.value)} />
            </div>
            <div>
              <Label>Stripe Secret Key</Label>
              <Input placeholder="sk_live_..." value={stripeSecretKey} onChange={(e) => setStripeSecretKey(e.target.value)} />
            </div>
          </div>
          <Button variant="outline" onClick={saveSettings}>Update Payment Keys</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between border rounded p-3">
            <div>
              <div className="font-medium">Email Provider</div>
              <div className="text-xs text-gray-500">Enable transactional emails</div>
            </div>
            <Switch checked={emailProviderEnabled} onCheckedChange={setEmailProviderEnabled} />
          </div>
          <div className="flex items-center justify-between border rounded p-3">
            <div>
              <div className="font-medium">SMS Provider</div>
              <div className="text-xs text-gray-500">Enable SMS notifications</div>
            </div>
            <Switch checked={smsProviderEnabled} onCheckedChange={setSmsProviderEnabled} />
          </div>
          <Separator />
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Twilio SID</Label>
              <Input value={twilioSid} onChange={(e) => setTwilioSid(e.target.value)} />
            </div>
            <div>
              <Label>Twilio Auth Token</Label>
              <Input value={twilioAuth} onChange={(e) => setTwilioAuth(e.target.value)} />
            </div>
            <div>
              <Label>Twilio From</Label>
              <Input value={twilioFrom} onChange={(e) => setTwilioFrom(e.target.value)} />
            </div>
          </div>
          <Button variant="outline" onClick={saveSettings}>Update Notification Settings</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPanel;


