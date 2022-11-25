import { useLogout } from "@thirdweb-dev/react/solana";
import { ThirdwebSDK } from "@thirdweb-dev/sdk/solana";
import { GetServerSideProps } from "next";

import Image from "next/image";
import Link from "next/link";
import { getUser } from "../../auth.config";
import pfp from "../../public/media/pfp.png";

import { network } from "./_app";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const sdk = ThirdwebSDK.fromNetwork(network);
  const user = await getUser(req);

  if (!user)
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };

  const program = await sdk.getNFTDrop(
    process.env.NEXT_PUBLIC_PROGRAM_ADDRESS!
  );
  const nfts = await program.getAllClaimed();
  const nft = nfts.find((nft) => nft.owner === user.address);

  if (!nft)
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };

  return {
    props: {},
  };
};

const Home = () => {
  const logout = useLogout();
  return (
    <>
      <div className="flex flex-col min-h-screen justify-center items-center mx-auto -z-20 px-5">
        <p className="fixed top-10 text-xs md:text-base bg-red-500 rounded-full px-4 md:px-8 py-3 font-bold text-white mx-10">
          MEMBERS ONLY: This page is only accessible to users who have purchased
          & hold a DIGI NFT
        </p>

        <div className="absolute top-50 left-0 w-full h-1/2 bg-transparent -skew-y-6 z-10 overflow-hidden">
          <div className="flex items-center w-full h-full opacity-30">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white text-center -mx-20">
              MEMBERS ONLY MEMBERS ONLY MEMBERS ONLY MEMBERS ONLY MEMBERS ONLY
              MEMBERS ONLY MEMBERS ONLY MEMBERS ONLY MEMBERS ONLY MEMBERS ONLY
              MEMBERS ONLY MEMBERS ONLY MEMBERS ONLY MEMBERS ONLY MEMBERS ONLY
              MEMBERS ONLY MEMBERS ONLY MEMBERS ONLY MEMBERS ONLY MEMBERS ONLY
              MEMBERS ONLY MEMBERS ONLY MEMBERS ONLY MEMBERS ONLY MEMBERS ONLY
              MEMBERS ONLY MEMBERS ONLY MEMBERS ONLY MEMBERS ONLY MEMBERS ONLY
              MEMBERS ONLY MEMBERS ONLY MEMBERS ONLY MEMBERS ONLY MEMBERS ONLY
              MEMBERS ONLY MEMBERS ONLY MEMBERS ONLY MEMBERS ONLY MEMBERS ONLY
              MEMBERS ONLY MEMBERS ONLY
            </h1>
          </div>
        </div>

        <section className="md:mb-10 z-10 space-y-4 text-center">
          <h1 className="text-3xl lg:text-6xl font-bold">
            Introducing the{" "}
            <span className="text-[#39D326]">DIGI Members Area</span>
          </h1>
          <h2 className="text-xl lg:text-3xl">
            <span className="font-extrabold underline decoration-[#39D326]">
              Daily
            </span>{" "}
            Waste of time coming to this website!
          </h2>
        </section>

        <Image
          alt="profile picture"
          src={pfp}
          width={400}
          height={400}
          className="mt-5 z-10 shadow-2xl mb-10"
        />
        <Link
          href="https://www.twitter.com/digidesigned"
          className="font-extrabold text-lg md:text-2xl text-[#39D326] transition duration-200 hover:underline my-5 z-50"
        >
          Visit{" "}
          <span className="font-extrabold underline decoration-[#39D326] text-[#39D326] transition duration-200">
            Digi on Twitter
          </span>{" "}
          to make yourself bored!
        </Link>
        <button
          onClick={logout}
          className="bg-[#39D326] text-white py-4 px-10 border-2 border-[#39D326] hover:bg-white hover:text-[#39D326] mt-5 uppercase font-bold transition duration-200 rounded-md z-50"
        >
          Logout
        </button>
      </div>
    </>
  );
};

export default Home;
