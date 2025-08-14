import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Eye, HelpCircle, Rocket, Wrench, Info, Mail, Keyboard } from "lucide-react";

const HelpPanel: React.FC = () => {
  const copyDiagnostics = async () => {
    try {
      const payload = [
        `User Agent: ${navigator.userAgent}`,
        `Language: ${navigator.language}`,
        `Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
        `Location: ${window.location.href}`,
      ].join('\n');
      await navigator.clipboard.writeText(payload);
      // eslint-disable-next-line no-alert
      alert('Diagnostics copied to clipboard');
    } catch {
      // eslint-disable-next-line no-alert
      alert('Failed to copy diagnostics');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Help & Support</h2>
          <p className="text-gray-600">Guides, FAQs, and troubleshooting for the admin panel</p>
        </div>
        <HelpCircle className="h-6 w-6 text-green-600" />
      </div>

      {/* Quick Start */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2"><Rocket className="h-4 w-4 text-green-600" /> Quick Start</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-700 space-y-3">
          <ol className="list-decimal pl-5 space-y-1">
            <li>Use the sidebar to navigate: Bookings, Users, Accommodations, Transportation, Tours.</li>
            <li>Generate and download insights in Reports; filter by date.</li>
            <li>Update system configuration in Settings (URLs, providers, toggles).</li>
            <li>Review KPIs and trends in Analytics; switch time ranges.</li>
          </ol>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={copyDiagnostics}><Info className="h-4 w-4 mr-2" />Copy Diagnostics</Button>
            <a href="mailto:support@ndarehe.com"><Button size="sm"><Mail className="h-4 w-4 mr-2" />Email Support</Button></a>
          </div>
        </CardContent>
      </Card>

      {/* FAQs */}
      <Card>
        <CardHeader>
          <CardTitle>FAQs</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I add a new accommodation, transport, tour, or user?</AccordionTrigger>
              <AccordionContent>
                Go to the Dashboard tab and click <b>Add New</b>. Choose the entity and fill in the form. You can also manage entries from their respective pages.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Why can’t I see any data on pages?</AccordionTrigger>
              <AccordionContent>
                Ensure your backend is running and reachable. The UI falls back to mock data for search/filters; once the API is reachable, live data will appear.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>How can I export reports?</AccordionTrigger>
              <AccordionContent>
                Open <b>Reports</b>, select a <b>date range</b>, click <b>Generate Report</b>, then <b>Download CSV</b>.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>How do I configure email/SMS providers?</AccordionTrigger>
              <AccordionContent>
                Open <b>Settings</b>, enable providers and enter keys (e.g., Twilio, Stripe, email From). Save changes. Integration endpoints can be wired next.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2"><Wrench className="h-4 w-4 text-green-600" /> Troubleshooting</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-700 space-y-2">
          <ul className="list-disc pl-5 space-y-1">
            <li>Hard refresh (Ctrl/Cmd+Shift+R) to clear cached assets.</li>
            <li>Check your API base URL and CORS settings.</li>
            <li>Rate-limited? Wait a minute or reduce rapid requests.</li>
            <li>Verify JWT token presence in requests for protected endpoints.</li>
          </ul>
          <Separator className="my-3" />
          <div className="flex items-center text-xs text-gray-500 gap-2"><Info className="h-3.5 w-3.5" /> For persistent issues, copy diagnostics and share with support.</div>
        </CardContent>
      </Card>

      {/* Keyboard Shortcuts */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2"><Keyboard className="h-4 w-4 text-green-600" /> Keyboard Tips</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center justify-between border rounded p-3">
            <span>Focus search (on listing pages)</span>
            <code className="text-xs bg-gray-100 rounded px-2 py-1">/</code>
          </div>
          <div className="flex items-center justify-between border rounded p-3">
            <span>Clear filters</span>
            <code className="text-xs bg-gray-100 rounded px-2 py-1">Alt + C</code>
          </div>
          <div className="flex items-center justify-between border rounded p-3">
            <span>Open Add New (dashboard)</span>
            <code className="text-xs bg-gray-100 rounded px-2 py-1">Alt + N</code>
          </div>
          <div className="flex items-center justify-between border rounded p-3">
            <span>Generate report</span>
            <code className="text-xs bg-gray-100 rounded px-2 py-1">Alt + G</code>
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Contact Support</CardTitle>
          <Eye className="h-5 w-5 text-green-600" />
        </CardHeader>
        <CardContent className="text-sm text-gray-700 space-y-2">
          <div>Email: <a className="text-green-700 hover:underline" href="mailto:support@ndarehe.com">support@ndarehe.com</a></div>
          <div>Hours: Mon–Fri, 09:00–18:00 (GMT+2)</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpPanel;


