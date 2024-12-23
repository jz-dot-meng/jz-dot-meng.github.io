import { GameButton } from "@components/common/buttons/GameButton";
import { Radio, RadioOption } from "@components/common/buttons/Radio";
import { Header } from "@components/common/header/Header";
import { useUserContext } from "@context/UserContext";
import { Keypair } from "@solana/web3.js";
import { Identicon } from "@utils/functions/identicon";
import { getUserAddress } from "@utils/functions/user";
import { parseChainMode } from "@utils/functions/validator";
import { User } from "@utils/types/user";
import { encodeBase58, Wallet } from "ethers";
import _ from "lodash";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Profile: React.FunctionComponent = () => {
    const { user, updateUser } = useUserContext();

    const [address, setAddress] = useState<string>("");
    const [isUpdating, setIsUpdating] = useState(false);

    const [editedUser, setEditedUser] = useState<User | undefined>(user);

    const vmOptions: RadioOption[] = [
        { display: "Ethereum", value: "evm" },
        { display: "Solana", value: "svm" },
    ];

    /* -------------------------------------------------------------------------- */
    /*                                   COPYING                                  */
    /* -------------------------------------------------------------------------- */

    const copyPKToClipboard = () => {
        if (editedUser) {
            navigator.clipboard.writeText(editedUser.privateKey);
            toast.info(`Private key copied to clipboard`);
        } else if (user) {
            navigator.clipboard.writeText(user.privateKey);
            toast.info(`Private key copied to clipboard`);
        }
    };

    /* -------------------------------------------------------------------------- */
    /*                                   EDITING                                  */
    /* -------------------------------------------------------------------------- */

    const handleSelectPKType = (value: string) => {
        const parsed = parseChainMode(value);
        const useDefaultName = editedUser.name === getUserAddress(editedUser).slice(-5);

        switch (parsed) {
            case "evm": {
                const newWallet = Wallet.createRandom();
                const privateKey = newWallet.privateKey;
                setEditedUser({
                    ...editedUser,
                    privateKey,
                    privateKeyType: parsed,
                    name: useDefaultName ? newWallet.address.slice(-5) : editedUser.name,
                    pfp: `data:image/svg+xml;base64,${new Identicon(newWallet.address).toString()}`,
                });
                break;
            }
            case "svm": {
                const newWallet = Keypair.generate();
                const privateKey = encodeBase58(newWallet.secretKey);
                setEditedUser({
                    ...editedUser,
                    privateKey,
                    privateKeyType: parsed,
                    name: useDefaultName
                        ? newWallet.publicKey.toBase58().slice(-5)
                        : editedUser.name,
                    pfp: `data:image/svg+xml;base64,${new Identicon(
                        newWallet.publicKey.toBase58()
                    ).toString()}`,
                });
                break;
            }
        }
    };

    const restoreOriginal = () => {
        setEditedUser(user);
    };

    const handleSetEditedName = (value: string) => {
        setEditedUser({
            ...editedUser,
            name: value,
        });
    };

    const handleResetAnonName = () => {
        const address = getUserAddress(editedUser);
        setEditedUser({
            ...editedUser,
            name: address.slice(-5),
        });
    };

    const handleUpdate = async () => {
        setIsUpdating(() => true);
        await updateUser(editedUser).catch((err) => {
            console.error({ msg: "unexpected error while updating profile", err });
            toast.error(`An unexpected error occurred while updating your profile!`);
        });
        setIsUpdating(() => false);
    };

    useEffect(() => {
        setEditedUser(user);
    }, [user]);

    useEffect(() => {
        if (!editedUser) return;
        const userAddress = getUserAddress(editedUser);
        setAddress(userAddress);
    }, [editedUser]);

    return (
        <div className="flex h-full p-8 overflow-y-scroll">
            <div className="flex flex-col gap-8 w-full">
                <section className="flex flex-col gap-4">
                    <Header />
                    <div className="flex items-start flex-col gap-1 lg:items-end lg:flex-row">
                        <h1>profile</h1>
                        <span className="pb-2"> :: view and edit your online display</span>
                    </div>
                </section>
                <section className="text-grey-600">
                    <p>
                        Your profile across all @jz-dot-meng pages is generated and verified using
                        public key/private key cryptography (the same logic that powers
                        cryptocurrency blockchains like Ethereum and Solana - can you guess where i
                        work?)
                    </p>
                    <p>
                        The private key is generated and stored in your local browser storage, and{" "}
                        <mark className="bg-black-900 text-red-300 font-medium">
                            (this is important!) is never stored anywhere else!
                        </mark>{" "}
                        This means if your browser regularly clears the local storage, the next time
                        you return here you will not be able to retrieve the same profile, and a new
                        one will be generated for you. If you want to keep the same profile, or use
                        the same profile across multiple devices or browsers, feel free to export
                        the private key, <strike>and import it into your new browser/device</strike>{" "}
                        (this isn't supported yet). These private keys can be also imported as
                        cryptocurrency wallets as well!
                    </p>
                </section>
                <section className="flex gap-4">
                    <h3 className={_.isEqual(user, editedUser) ? "" : "text-grey-600"}>
                        View Mode
                    </h3>
                    <h3 className="text-grey-600">|</h3>
                    <h3 className={!_.isEqual(user, editedUser) ? "text-red-400" : "text-grey-600"}>
                        Edit Mode
                    </h3>
                </section>
                <section className="flex flex-col py-8 lg:flex-row gap-8">
                    <div className="flex gap-4 flex-col flex-1 justify-center items-center">
                        <Image
                            alt={"pfp"}
                            src={editedUser?.pfp}
                            height={0}
                            width={0}
                            className="w-1/2 h-auto"
                        />
                        <p className="text-grey-600 text-xs text-center">
                            Your pfp (generated from your public key address, <code>{address}</code>
                            )
                        </p>
                    </div>
                    <div className="flex-2 flex flex-col gap-4">
                        {/** private key */}
                        <div className="flex gap-4 items-center">
                            <div className="flex-1">
                                <p>Private Key</p>
                                <div className="text-xs">
                                    <p className="text-red-300">
                                        Never ever share this with anyone!
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-4 gap-4">
                                <input
                                    type={"text"}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        copyPKToClipboard();
                                    }}
                                    value={editedUser?.privateKey}
                                    className={`form-control w-full h-[42px] cursor-pointer text-white placeholder-grey-300 flex-4 bg-grey-800 rounded-md text-xs px-3 py-3 caret-coral-400 focus:ring-transparent border-grey-400 hover:border-coral-300 focus:border-coral-400 focus:ring-coral-400`}
                                />
                                <div className="flex-1 flex items-center">
                                    <Radio
                                        options={vmOptions}
                                        selected={editedUser?.privateKeyType || ""}
                                        select={handleSelectPKType}
                                    />
                                </div>
                            </div>
                        </div>
                        {/** user name */}
                        <div className="flex gap-4 items-center">
                            <div className="flex-1">
                                <p>Username</p>
                            </div>
                            <div className="flex flex-4 items-center gap-4">
                                <div className="flex-4 flex items-center gap-2">
                                    <p>@</p>
                                    <input
                                        type={"text"}
                                        onClick={(e) => e.stopPropagation()}
                                        value={editedUser?.name}
                                        className={`form-control w-full h-[42px] text-white cursor-text placeholder-grey-300 flex-1 bg-grey-800 rounded-md text-xs px-3 py-3 caret-coral-400 focus:ring-transparent border-grey-400 hover:border-coral-300 focus:border-coral-400 focus:ring-coral-400`}
                                        onChange={(e) => handleSetEditedName(e.target.value)}
                                    />
                                </div>
                                <div className="flex-1 flex items-center justify-center">
                                    <button onClick={() => handleResetAnonName()}>
                                        Reset anon
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center items-center gap-4 mt-4">
                            {/* <GameButton buttonText="Import Private Key" /> */}
                            <GameButton
                                buttonText={isUpdating ? "Saving..." : "Save changes"}
                                disabled={isUpdating || _.isEqual(user, editedUser)}
                                onClick={() => handleUpdate()}
                                bgColor="bg-coral-600/80"
                            />
                            <GameButton
                                buttonText="Undo"
                                disabled={_.isEqual(user, editedUser)}
                                onClick={() => restoreOriginal()}
                            />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Profile;
