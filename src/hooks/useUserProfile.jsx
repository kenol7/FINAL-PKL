import { useState, useEffect } from "react";

export function useUserProfile() {
    const [user, setUser] = useState({
        email: localStorage.getItem("auth_email") || null,
        name: localStorage.getItem("auth_fullname") || null,
        phone: localStorage.getItem("auth_phone") || null,
        foto: localStorage.getItem("foto_profil") || "/noProfilePict/noprofile_pict.jpeg",
    });

    useEffect(() => {
        const handleStorageChange = () => {
            setUser({
                email: localStorage.getItem("auth_email") || null,
                name: localStorage.getItem("auth_fullname") || null,
                phone: localStorage.getItem("auth_phone") || null,
                foto: localStorage.getItem("foto_profil") || "/noProfilePict/noprofile_pict.jpeg",
            });
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return user;
}

//https://smataco.my.id/dev/unez/CariRumahAja/foto/ProfilePicture/noProfilePict/noprofile_pict.jpeg
