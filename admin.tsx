import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LayoutDashboard, Users, TrendingUp, Video, DollarSign, CheckCircle, XCircle, MessageSquare, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MOCK_STATS = {
  totalAdViews: 12450,
  totalRevenue: 124500,
  activeUsers: 3456,
  pendingPromotions: 8,
};

const MOCK_PENDING_PROMOTIONS = [
  {
    id: "1",
    username: "user123",
    platform: "youtube",
    videoUrl: "https://youtube.com/watch?v=example1",
    duration: 7,
    goalType: "views",
    goalAmount: 10000,
    cost: 500,
  },
  {
    id: "2",
    username: "creator456",
    platform: "tiktok",
    videoUrl: "https://tiktok.com/@user/video/example2",
    duration: 3,
    goalType: "likes",
    goalAmount: 5000,
    cost: 300,
  },
];

const MOCK_TRANSACTIONS = [
  {
    id: "1",
    username: "user789",
    type: "buy_gemasgo",
    amount: 10000,
    cost: "$85 USDT",
    status: "pending",
  },
  {
    id: "2",
    username: "player123",
    type: "free_fire",
    amount: 500,
    cost: "2000 GemasGo",
    status: "completed",
  },
];

export default function Admin() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [message, setMessage] = useState("");

  const handleApprove = (id: string) => {
    toast({
      title: t("success"),
      description: "Promotion approved successfully!",
    });
  };

  const handleReject = (id: string) => {
    toast({
      title: "Rejected",
      description: "Promotion has been rejected.",
      variant: "destructive",
    });
  };

  const handleSendMessage = () => {
    toast({
      title: t("success"),
      description: "Message sent to user!",
    });
    setShowMessageDialog(false);
    setMessage("");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
          {t("adminPanel")}
        </h1>
        <p className="text-muted-foreground">
          Manage the entire GemasGo platform from this dashboard
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("totalAdViews")}
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-mono font-bold" data-testid="text-total-ad-views">
              {MOCK_STATS.totalAdViews.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("totalRevenue")}
            </CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-mono font-bold text-primary" data-testid="text-total-revenue">
              {MOCK_STATS.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              GemasGo points (80% share)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("activeUsers")}
            </CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-mono font-bold" data-testid="text-active-users">
              {MOCK_STATS.activeUsers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +8% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("pendingPromotions")}
            </CardTitle>
            <Video className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-mono font-bold text-orange-500" data-testid="text-pending-promotions">
              {MOCK_STATS.pendingPromotions}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting approval
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Management Tabs */}
      <Tabs defaultValue="promotions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="promotions" data-testid="tab-admin-promotions">
            <Video className="w-4 h-4 mr-2" />
            Promotions
          </TabsTrigger>
          <TabsTrigger value="transactions" data-testid="tab-admin-transactions">
            <DollarSign className="w-4 h-4 mr-2" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="messages" data-testid="tab-admin-messages">
            <MessageSquare className="w-4 h-4 mr-2" />
            Messages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="promotions">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-serif">{t("approvePromotions")}</CardTitle>
              <CardDescription>
                Review and approve video promotions submitted by users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Goal</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_PENDING_PROMOTIONS.map((promo) => (
                    <TableRow key={promo.id} data-testid={`row-promo-${promo.id}`}>
                      <TableCell className="font-medium">{promo.username}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{promo.platform}</Badge>
                      </TableCell>
                      <TableCell>
                        {promo.goalAmount.toLocaleString()} {promo.goalType}
                      </TableCell>
                      <TableCell>{promo.duration} days</TableCell>
                      <TableCell className="font-mono">{promo.cost}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(promo.id)}
                            data-testid={`button-approve-${promo.id}`}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            {t("approve")}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(promo.id)}
                            data-testid={`button-reject-${promo.id}`}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            {t("reject")}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-serif">Transaction Management</CardTitle>
              <CardDescription>
                View and manage user transactions and purchases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_TRANSACTIONS.map((tx) => (
                    <TableRow key={tx.id} data-testid={`row-transaction-${tx.id}`}>
                      <TableCell className="font-medium">{tx.username}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{tx.type}</Badge>
                      </TableCell>
                      <TableCell>{tx.amount.toLocaleString()}</TableCell>
                      <TableCell className="font-mono">{tx.cost}</TableCell>
                      <TableCell>
                        {tx.status === "completed" ? (
                          <Badge className="bg-green-500">{t("completed")}</Badge>
                        ) : (
                          <Badge variant="secondary">{t("pending")}</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedUser(tx.username);
                            setShowMessageDialog(true);
                          }}
                          data-testid={`button-send-receipt-${tx.id}`}
                        >
                          <Upload className="w-4 h-4 mr-1" />
                          Send Receipt
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-serif">User Messages</CardTitle>
              <CardDescription>
                Send notifications and payment receipts to users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="Enter username"
                      value={selectedUser}
                      onChange={(e) => setSelectedUser(e.target.value)}
                      data-testid="input-message-username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="image">Receipt Image (optional)</Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      data-testid="input-message-image"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Type your message to the user..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    data-testid="textarea-message"
                  />
                </div>
                <Button onClick={handleSendMessage} data-testid="button-send-message">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {t("sendMessage")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Message Dialog */}
      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <DialogContent data-testid="dialog-send-message">
          <DialogHeader>
            <DialogTitle>Send Payment Receipt</DialogTitle>
            <DialogDescription>
              Send a payment confirmation to {selectedUser}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="dialog-message">Message</Label>
              <Textarea
                id="dialog-message"
                placeholder="Your transaction has been completed..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="dialog-image">Receipt Image</Label>
              <Input id="dialog-image" type="file" accept="image/*" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMessageDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage}>
              Send Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
