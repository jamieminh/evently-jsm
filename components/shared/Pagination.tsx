"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { formUrlQuery } from "@/lib/utils";

type Props = {
  urlParamName?: string;
  page: number | string;
  totalPages: number;
};

enum PaginationButtons {
  Previous = "prev",
  Next = "next",
}

const Pagination = ({ urlParamName, page, totalPages }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const changePage = (btnType: string) => {
    let newUrl = "";

    const newPage =
      btnType === PaginationButtons.Next ? Number(page) + 1 : Number(page) - 1;
    newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: newPage.toString(),
    });

    if (newPage >= 1 && newPage <= totalPages) {
      router.push(newUrl, { scroll: false });
    }
  };

  const goToNextPage = () => {
    changePage(PaginationButtons.Next);
  };

  const goToPrevPage = () => {
    changePage(PaginationButtons.Previous);
  };

  return (
    <div className="flex gap-2">
      <Button
        size={"lg"}
        variant={"outline"}
        className="w-28"
        onClick={goToPrevPage}
        disabled={Number(page) <= 1}
      >
        Previous
      </Button>
      <Button
        size={"lg"}
        variant={"outline"}
        className="w-28"
        onClick={goToNextPage}
        disabled={Number(page) >= totalPages}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
