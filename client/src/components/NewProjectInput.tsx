import { useState, useRef } from 'react'
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import axios from 'axios'


const NewProjectInput = () => {

    const [usedAi, setUsedAi] = useState<boolean>(true);

    const [nameFieldError, setNameFieldError] = useState<string>("");
    const [forWhoFieldError, setForWhoFieldError] = useState<string>("");
    const [doingWhatFieldError, setDoingWhatFieldError] = useState<string>("");
    const [additionalInfoFieldError, setAdditionalInfoFieldError] = useState<string>("");

    const nameFieldRef = useRef<HTMLInputElement>(null);
    const forWhoFieldRef = useRef<HTMLTextAreaElement>(null);
    const doingWhatFieldRef = useRef<HTMLTextAreaElement>(null);
    const additionalInfoFieldRef = useRef<HTMLTextAreaElement>(null);

    /**
     * check if the name field is valid
     * @returns true if the name field is valid, false otherwise
     */
    const validateNameField = (): boolean => {
        const name = nameFieldRef.current?.value || '';

        if (!name) {
            setNameFieldError("Error: name cannot be empty.");
            return false;
        } else if (name.length > 50) {
            setNameFieldError("Error: max name length is 50 characters.");
            return false;
        } else {
            setNameFieldError("");
        }

        return true;
    }

    /**
     * check if the for who field is valid
     * @returns true if the for who field is valid or user do not use AI, false otherwise
     */
    const validateForWhoField = (): boolean => {
        if (!usedAi) return true;

        const forWho = forWhoFieldRef.current?.value || '';

        if (!forWho) {
            setForWhoFieldError("Error: for who field cannot be empty.");
            return false;
        } else if (forWho.length > 100) {
            setForWhoFieldError("Error: max for who length is 100 characters.");
            return false;
        } else {
            setForWhoFieldError("");
        }

        return true;
    }

    /**
     * check if the doing what field is valid
     * @returns true if the doing what field is valid or user do not use AI, false otherwise
     */
    const validateDoingWhatField = (): boolean => {
        if (!usedAi) return true;

        const doingWhat = doingWhatFieldRef.current?.value || '';

        if (!doingWhat) {
            setDoingWhatFieldError("Error: doing what cannot be empty.");
            return false;
        } else if (doingWhat.length > 100) {
            setDoingWhatFieldError("Error: max doing what length is 100 characters.");
            return false;
        } else {
            setDoingWhatFieldError("");
        }

        return true;
    }

    /**
     * check if the additional info field is valid
     * @returns true if the additional info field is valid or user do not use AI, false otherwise
     */
    const validateAdditionalInfoField = (): boolean => {
        if (!usedAi) return true;

        const additionalInfo = additionalInfoFieldRef.current?.value || '';

        if (additionalInfo.length > 100) {
            setAdditionalInfoFieldError("Error: max additional info length is 100 characters.");
            return false;
        } else {
            setAdditionalInfoFieldError("");
        }

        return true;
    }


    // TO DO:
    const submitButton = (): void => {

        const isCorrectName = validateNameField();
        const isCorrectForWhoField = validateForWhoField();
        const isCorrectDoingWhatField = validateDoingWhatField();
        const isCorrectAdditionalInformationField = validateAdditionalInfoField();

        if (!isCorrectName || !isCorrectForWhoField || !isCorrectDoingWhatField || !isCorrectAdditionalInformationField) {
            return;
        }

        // send api request to server
        const request = {
            name: nameFieldRef.current?.value,
            for_who: forWhoFieldRef.current?.value,
            doing_what: doingWhatFieldRef.current?.value,
            additional_info: additionalInfoFieldRef.current?.value,
        }


        axios.post('http://localhost:8000/projects/create', null, {
            params: {
                name: nameFieldRef.current?.value,
                for_who: forWhoFieldRef.current?.value,
                doing_what: doingWhatFieldRef.current?.value,
                additional_info: additionalInfoFieldRef.current?.value,
            }, headers: {
                'Content-Type': 'application/json'
            }
        }
        ).then(response => {
            console.log(response.data);
        }).catch(error => {
            console.error('Error creating project:', error);
        });


        alert("ok.");
    }

    return (
        <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
            <div
                className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
                aria-hidden="true"
            >
                <div
                    className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
                    style={{
                        clipPath:
                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                    }}
                />
            </div>
            <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Create new project</h2>
                <p className="mt-2 text-lg leading-8 text-gray-600">
                    You can use AI or create an empty project.
                </p>
            </div>
            <div className="mx-auto mt-16 max-w-xl sm:mt-20">
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">

                    <div className="sm:col-span-2">
                        <label htmlFor="company" className="block text-sm font-semibold leading-6 text-gray-900">
                            Name
                        </label>
                        <div className="mt-2.5">
                            <Input type="email" ref={nameFieldRef} onChange={() => validateNameField()} />
                            {nameFieldError && <p className='text-xs mt-1 text-red-500	'>{nameFieldError}</p>}
                        </div>
                    </div>


                    <div className="flex items-center space-x-2">
                        <Switch id="airplane-mode" checked={usedAi}
                            onCheckedChange={setUsedAi} />
                        <Label htmlFor="airplane-mode">Generate using AI.</Label>
                    </div>
                </div>
                {usedAi && <div>
                    <div className="sm:col-span-2 mt-2.5">
                        <label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900">
                            For who?
                        </label>
                        <div className="mt-2.5">
                            <Textarea ref={forWhoFieldRef} onChange={() => validateForWhoField()} />
                            {forWhoFieldError && <p className='text-xs mt-1 text-red-500	'>{forWhoFieldError}</p>}

                        </div>
                    </div>
                    <div className="sm:col-span-2 mt-2.5">
                        <label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900">
                            Doing what?
                        </label>
                        <div className="mt-2.5">
                            <Textarea ref={doingWhatFieldRef} onChange={() => validateDoingWhatField()} />
                            {doingWhatFieldError && <p className='text-xs mt-1 text-red-500	'>{doingWhatFieldError}</p>}

                        </div>
                    </div>

                    <div className="sm:col-span-2 mt-2.5">
                        <label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900">
                            Additional information?
                        </label>
                        <div className="mt-2.5">
                            <Textarea ref={additionalInfoFieldRef} onChange={() => validateAdditionalInfoField()} />
                            {additionalInfoFieldError && <p className='text-xs mt-1 text-red-500	'>{additionalInfoFieldError}</p>}

                        </div>
                    </div>
                </div>}


                <div className="mt-10">
                    <Button
                        onClick={() => submitButton()}
                        type="submit"
                        className="block w-full rounded-md  px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Generate
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default NewProjectInput;