import Button from "../Elements/Button";
import Input from "../Elements/Input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThreeCircles } from 'react-loader-spinner'

const LKS = () => {

    const [nomerHandphone, setNomerHandphone] = useState("");
    const navigate = useNavigate();

    const handleInputChange = (newValue) => {
        const numericValue = newValue.replace(/[^0-9]/g, '');
        if (numericValue === '') {
            setNomerHandphone('');
            return;
        }

        let correctedValue = numericValue;
        if (correctedValue.length === 1 && correctedValue.startsWith('8')) {
            correctedValue = '0' + correctedValue;
        }

        if (correctedValue.startsWith('08')) {
            const limitedValue = correctedValue.slice(0, 13);
            setNomerHandphone(limitedValue);
        }
    };
    return (
        <div className="vh-100 d-flex">
            <p className="font-jakarta text-[14px] text-center justify-content-center mt-7">Masukkan nomer yang telah terdaftar</p>
            <div className="mt-15 flex flex-col ml-5 ">
                <label className="font-jakarta text-xs semi-bold">Nomer Handphone </label>
                <Input
                    type="text"
                    name="nomerHandphone"
                    value={nomerHandphone}
                    onChange={handleInputChange}
                    className="font-jakarta text-xs text-black text-center"
                />

                <Button className="text-center mx-auto mt-25" onClick={() => navigate("/verifikasikode")}>
                    Lanjut
                </Button>
            </div>

        </div>
    );
};

export default LKS;