import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button, buttonVariants } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useCookies } from "react-cookie";
import { Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
// import { cookies } from "next/headers";

const Card = () => {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [visitCount, setVisitCount] = useState(0);
  const [cookies, _] = useCookies(["jwt"]);
  const navigate = useNavigate();

  let userId: string | null = "";
  if (typeof window !== "undefined") {
    userId = localStorage?.getItem("userID");
  }

  const validateUrl = () => {
    if (url.includes("http://") || url.includes("https://")) {
      return true;
    } else {
      return false;
    }
  };

  const totalClicks = async () => {
    try {
      if (shortUrl === "") {
        return;
      }
      const { data } = await axios.post(
        "https://tinyurl-8d0g.onrender.com/api/tinyurl/analytics",
        { shortUrl },
        { headers: { authorization: cookies.jwt } }
      );
      setVisitCount(data.totalVisitsCount);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    totalClicks();
  }, [shortUrl]);

  setInterval(() => {
    totalClicks()
  }, 10000)

  const generateShortUrl = async () => {
    if (!validateUrl()) {
      toast.error("Enter a valid Url");
      return;
    }
    if (!cookies.jwt) {
      toast.error("You need to sign in to continue");
      navigate("/signin");
      return;
    }
    try {
      const { data } = await axios.post(
        "https://tinyurl-8d0g.onrender.com/api/tinyurl/create",
        { url, userId },
        { headers: { authorization: cookies.jwt } }
      );
      setShortUrl(data.tinyURL);
      toast.success("Short URL Created");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const copyPasswordToClipBoard = () => {
    window.navigator.clipboard.writeText(shortUrl);
    toast.success("URL copied to clip board");
  };

  return (
    <div className="container bg-zinc-300 rounded-lg max-w-2xl min-h-52 gap-y-4 space-y-1.5 shadow-xl border-zinc-300">
      <h1 className="text-4xl font-bold pt-7">Shorten a long URL</h1>
      <div className="text-2xl font-semibold text-zinc-700">
        Paste a long URL
      </div>
      <div className="flex gap-x-4">
        <Input
          id="input"
          type="text"
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Example: https://long-link.com/shorten-it"
          className=""
        />
        <Button onClick={generateShortUrl} disabled={url === ""}>
          Generate
        </Button>
      </div>
      {shortUrl ? (
        <div className="p-2">
          <div className="flex items-center space-x-4">
            <p className="font-bold text-zinc-700">Short URL: {shortUrl}</p>
            <Button onClick={copyPasswordToClipBoard}>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>
          <p className={cn(buttonVariants({ variant: "default" }))}>
            Total No. of Vistis on Url: {visitCount}
          </p>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Card;
