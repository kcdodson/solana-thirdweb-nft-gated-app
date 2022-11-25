import { useWallet } from "@solana/wallet-adapter-react";
import {
  useClaimNFT,
  useDropUnclaimedSupply,
  useLogin,
  useLogout,
  useNFTs,
  useProgram,
  useUser,
} from "@thirdweb-dev/react/solana";
import { NFT } from "@thirdweb-dev/sdk";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import pfp from "../../public/media/pfp.png";
import { wallet } from "./_app";

export default function LoginPage() {
  const [usersNft, setUsersNft] = useState<NFT | undefined>();
  const login = useLogin();
  const logout = useLogout();
  const router = useRouter();
  const { user } = useUser();
  const { publicKey, connect, select } = useWallet();
  const { program } = useProgram(
    process.env.NEXT_PUBLIC_PROGRAM_ADDRESS,
    "nft-drop"
  );
  const { data: unclaimedSupply } = useDropUnclaimedSupply(program);
  const { data: nfts, isLoading } = useNFTs(program);
  const { mutateAsync: claim } = useClaimNFT(program);

  useEffect(() => {
    if (!publicKey) {
      select(wallet.name);
      connect();
    }
  }, [publicKey, wallet]);

  useEffect(() => {
    if (!user || !nfts) return;

    const usersNft = nfts.find((nft) => nft.owner === user?.address);

    if (usersNft) {
      setUsersNft(usersNft);
    }
  }, [nfts, user]);

  const handleLogin = async () => {
    await login();
    router.replace("/");
  };

  const handlePurchase = async () => {
    await claim({
      amount: 1,
    });
    router.replace("/");
  };

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center text-center bg-[#27292a]">
        <div className="absolute top-56 left-0 w-full h-1/4 bg-[#39D326] -skew-y-6 z-10 overflow-hidden shadow-xl" />
        <Image
          className="mt-5 z-30 shadow-2xl mb-10 rounded-full"
          src={pfp}
          alt="logo"
          width={400}
          height={400}
        />
        <main className="z-30 text-white">
          <h1 className="text-4xl font-bold uppercase">
            Welcome to <span className="text-fuchsia-600">DIGI</span>
          </h1>
          {!user && (
            <div>
              <button
                onClick={handleLogin}
                className="text-2xl font-bold bg-[#39D326] text-white py-4 px-10 border-2 border-white animate-pulse rounded-md transition duration-300 mt-5"
              >
                Login / Connect Wallet
              </button>
            </div>
          )}
          {user && (
            <div>
              <p className="text-lg text-fuchsia-500 font-bold mb-10 mt-12">
                Logged in as:{" "}
                <span className="tracking-widest text-white bg-zinc-900 py-3 px-4 rounded-lg shadow-inner">
                  {user.address.slice(0, 5)} ... {user.address.slice(-5)}
                </span>
              </p>

              {isLoading && (
                <div className="flex flex-row items-center text-2xl font-bold mb-5 bg-fuchsia-600 text-white py-4 px-10 border-2 border-white animate-pulse rounded-md transition duration-200">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <p>
                    Hold on, We're just looking for your DIGI Membership pass...
                  </p>
                </div>
              )}

              {usersNft && (
                <Link
                  href="/"
                  className="text-2xl font-bold mb-5 bg-fuchsia-600 text-white py-4 px-10 border-2 border-white animate-pulse rounded-md transition duration-200 hover:bg-white hover:text-fuchsia-600 mt-5 uppercase"
                >
                  ACCESS GRANTED - ENTER
                </Link>
              )}

              {!usersNft &&
                !isLoading &&
                (unclaimedSupply && unclaimedSupply > 0 ? (
                  <button
                    onClick={handlePurchase}
                    className="bg-[#39D326] text-white py-4 px-10 border-2 border-white rounded-md hover:bg-white hover:text-[#39D326] mt-5 uppercase font-bold transition duration-200"
                  >
                    Buy a DIGI Membership Pass
                  </button>
                ) : (
                  <p className="text-2xl font-bold mb-5 bg-red-500 text-white py-4 px-10 border-2 border-red-500 rounded-md uppercase transition duration-200">
                    Sorry, we're all out of DIGI Membership passes!
                  </p>
                ))}
            </div>
          )}

          {user && (
            <button
              onClick={logout}
              className="bg-white text-[#39D326] py-4 px-10 border-2 border-white rounded-md hover:bg-[#39D326] hover:text-white mt-10 uppercase font-bold transition duration-200"
            >
              logout
            </button>
          )}
        </main>
      </div>
    </>
  );
}
