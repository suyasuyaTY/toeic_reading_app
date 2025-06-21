"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useAppContext } from "@/components/providers/AppContextProvider";
import { Save, Trash2, AlertTriangle } from "lucide-react";

export default function SettingsPage() {
  const { gasWebhookUrl, setGasWebhookUrl } = useAppContext();
  const [localUrl, setLocalUrl] = useState(gasWebhookUrl);
  const [message, setMessage] = useState("");
  const [warning, setWarning] = useState(false);

  const handleSave = () => {
    try {
      // 簡単なURL形式のチェック
      if (
        localUrl &&
        !localUrl.startsWith("https://script.google.com/macros/s/")
      ) {
        setMessage(
          "無効なURL形式です。GASのウェブアプリURLを入力してください。"
        );
        setWarning(true);
        return;
      }
      setGasWebhookUrl(localUrl);
      setMessage("設定を保存しました。");
      setWarning(false);
    } catch (e) {
      console.log(e);
      setMessage("保存に失敗しました。");
      setWarning(true);
    }
  };

  const handleClear = () => {
    setLocalUrl("");
    setGasWebhookUrl("");
    setWarning(false);
    setMessage("設定をクリアしました。");
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>設定</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label
            htmlFor="gas-url"
            className="block text-sm font-medium text-slate-700 dark:text-white mb-2"
          >
            Google Apps Script Webhook URL
          </label>
          <Input
            id="gas-url"
            type="text"
            value={localUrl}
            onChange={(e) => setLocalUrl(e.target.value)}
            placeholder="https://script.google.com/macros/s/..."
          />
          <p className="text-xs text-slate-500 mt-2 dark:text-white/80">
            解答結果を記録・集計するためのGASウェブアプリのURLを貼り付けてください。
          </p>
        </div>
        <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-400">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle
                className="h-5 w-5 text-yellow-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <p className="text-sm">
                このURLはブラウザのローカルストレージに保存され、外部に送信されることはありません。解答データのみがこのURLに送信されます。
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <Button variant="destructive" onClick={handleClear}>
            <Trash2 className="mr-2 h-4 w-4" /> クリア
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" /> 保存
          </Button>
        </div>
        {warning && message && (
          <p className="text-sm text-center text-red-600 mt-4">{message}</p>
        )}
        {!warning && message && (
          <p className="text-sm text-center text-green-600 mt-4">{message}</p>
        )}
      </CardContent>
    </Card>
  );
}
