import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { MoreHorizontal } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useCookies } from "react-cookie";

export type DashboardType = {
  id: string;
  shortUrl: string;
  originalUrl: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  vists: {
    id: string;
    shortUrlId: string;
    visitedAt: string;
  }[];
};



export function DataTable({ data }) {
  return (
    <Table>
      <TableCaption>A list of your urls.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">OriginalUrl</TableHead>
          <TableHead>TinyUrl</TableHead>
          <TableHead>Total Visits</TableHead>
          <TableHead className="text-right">actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((url) => (
          <TableRow key={url.id}>
            <TableCell className="font-medium w-60 truncate">
              {url.originalUrl}
            </TableCell>
            <TableCell>{url.shortUrl}</TableCell>
            <TableCell>{url.visits.length}</TableCell>
            <TableCell className="text-right">
              <Actions url={url} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

const Actions = ({ url }) => {

  const [cookies, _] = useCookies(["jwt"])
  const deleteUrl = async (shortUrl: string) => {
    try {
      await axios.delete(`https://tinyurl-8d0g.onrender.com/api/tinyurl/delete?url=${shortUrl}`, { headers: { authorization: cookies.jwt }});
      toast.success("Url Deleted Successfull");
    } catch (error: any) {
      toast.error(error.messsage);
    }
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => deleteUrl(url.shortUrl)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
