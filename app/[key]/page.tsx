import { Provider } from "jotai";
import { Suspense } from "react";
import Loader from "../components/loader";
import { findItemList } from "../actions";
import ItemsSummary from "./ItemSummary";

export default async function Page({ params } : { params: Promise<{ key: string }> }) {
  const key = (await params).key;

  return (
    <main className="container mx-auto flex flex-col items-center px-12 grow gap-6">
      <Suspense fallback={<Loader />}>
        <Provider>
          <ItemsSummary itemListFromServer={findItemList(key)} />
        </Provider>
      </Suspense>
    </main>
  );
}
