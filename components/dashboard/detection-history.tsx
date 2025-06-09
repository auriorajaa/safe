// components/dashboard/detection-history.tsx
import { useState, useMemo, useEffect } from "react";
import { DetectionRecord } from "@/lib/types";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  ArrowUpDown,
  FileSearch,
  Search,
  DollarSign,
  Eye,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteDetection } from "@/app/actions/dashboard/dashboard-actions";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";

interface DetectionHistoryProps {
  detections: DetectionRecord[];
  onDeleteRecord?: (id: string, isFraud: boolean) => void;
}

type SortField = "timestamp" | "type" | "status";
type SortDirection = "asc" | "desc";

export default function DetectionHistory({
  detections,
  onDeleteRecord,
}: DetectionHistoryProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("timestamp");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [localDetections, setLocalDetections] =
    useState<DetectionRecord[]>(detections);

  // Update local state when props change
  useEffect(() => {
    setLocalDetections(detections);
  }, [detections]);

  const filteredAndSortedDetections = useMemo(() => {
    // Apply filters
    let filtered = [...localDetections];

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((d) => d.detectionType === typeFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((d) =>
        statusFilter === "fraud" ? d.isFraud : !d.isFraud
      );
    }

    // Search filter - search through ID
    if (searchTerm) {
      filtered = filtered.filter((d) =>
        d.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortField === "timestamp") {
        return sortDirection === "asc"
          ? new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          : new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      } else if (sortField === "type") {
        return sortDirection === "asc"
          ? a.detectionType.localeCompare(b.detectionType)
          : b.detectionType.localeCompare(a.detectionType);
      } else if (sortField === "status") {
        return sortDirection === "asc"
          ? Number(a.isFraud) - Number(b.isFraud)
          : Number(b.isFraud) - Number(a.isFraud);
      }
      return 0;
    });

    return filtered;
  }, [
    localDetections,
    searchTerm,
    typeFilter,
    statusFilter,
    sortField,
    sortDirection,
  ]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Default to descending for a new field
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleView = (id: string) => {
    router.push(`/results/${id}`);
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      setIsDeleting(true);

      // Find the record to be deleted to access its isFraud status
      const recordToDelete = localDetections.find((d) => d.id === deletingId);

      if (!recordToDelete) {
        throw new Error("Record not found");
      }

      await deleteDetection(deletingId);

      // Update local state immediately for real-time UI update
      setLocalDetections((prev) =>
        prev.filter((detection) => detection.id !== deletingId)
      );

      // Call the callback to update the summary in parent component
      if (onDeleteRecord) {
        onDeleteRecord(deletingId, recordToDelete.isFraud);
      }

      toast.success("Detection record deleted successfully");

      // Still refresh the page data in the background
      router.refresh();
    } catch (error) {
      console.error("Error deleting detection:", error);
      toast.error("Failed to delete detection record");
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
      setIsDialogOpen(false);
    }
  };

  if (localDetections.length === 0) {
    return (
      <div className="text-center py-6">
        <FileSearch className="mx-auto h-10 w-10 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          No detections found
        </h3>
        <p className="mt-1 text-xs text-gray-500">
          Start using our fraud detection tools to see your history here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 px-3">
      <div className="flex flex-col sm:flex-row gap-3 justify-between mb-5">
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-9 text-sm"
          />
        </div>

        <div className="flex gap-2">
          {/* Type Filter */}
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-36 h-9 text-xs">
              <SelectValue placeholder="Detection Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="CREDIT_CARD">Credit Card</SelectItem>
              <SelectItem value="TRANSACTION">Transaction</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 h-9 text-xs">
              <SelectValue placeholder="Detection Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="fraud">Fraud</SelectItem>
              <SelectItem value="legitimate">Legitimate</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="text-xs py-2">Detection ID</TableHead>
              <TableHead className="text-xs">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("type")}
                  className="hover:bg-transparent p-0 h-auto font-medium text-xs"
                >
                  Type
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="text-xs">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("status")}
                  className="hover:bg-transparent p-0 h-auto font-medium text-xs"
                >
                  Status
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="text-xs">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("timestamp")}
                  className="hover:bg-transparent p-0 h-auto font-medium text-xs"
                >
                  Date
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {filteredAndSortedDetections.map((detection) => (
                <motion.tr
                  key={detection.id}
                  initial={{ opacity: 1 }}
                  exit={{
                    opacity: 0,
                    height: 0,
                    overflow: "hidden",
                    scale: 0.8,
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  layout
                  className="border-b"
                >
                  <TableCell className="font-mono text-xs py-2">
                    {detection.id}
                  </TableCell>
                  <TableCell className="py-2">
                    <div className="flex items-center">
                      {detection.detectionType === "CREDIT_CARD" ? (
                        <>
                          <CreditCard className="mr-1 h-3 w-3 text-blue-600" />
                          <span className="text-xs">Credit Card</span>
                        </>
                      ) : (
                        <>
                          <DollarSign className="mr-1 h-3 w-3 text-blue-600" />
                          <span className="text-xs">Transaction</span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-2">
                    {detection.isFraud ? (
                      <Badge
                        variant="outline"
                        className="text-xs px-2 py-0.5 bg-red-100 text-red-700"
                      >
                        Fraud
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-700 text-xs px-2 py-0.5"
                      >
                        Legitimate
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-xs py-2">
                    {new Date(detection.timestamp).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleView(detection.id)}
                        title="View details"
                      >
                        <Eye className="h-4 w-4 text-blue-600" />
                      </Button>

                      <AlertDialog
                        open={isDialogOpen && deletingId === detection.id}
                      >
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            title="Delete record"
                            onClick={() => {
                              setDeletingId(detection.id);
                              setIsDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Confirm Deletion
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this detection
                              record? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel
                              onClick={() => {
                                setDeletingId(null);
                                setIsDialogOpen(false);
                              }}
                            >
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDelete}
                              className="bg-red-600 hover:bg-red-700"
                              disabled={isDeleting}
                            >
                              {isDeleting ? "Deleting..." : "Delete"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
