import { useCallback, useState } from "react"

// 열고 닫기 커스텀 훅
export const useToggle = (initialValue: boolean = false) => {
    const [ value, setValue ] = useState(initialValue);

    const toggle = useCallback(() => {
        setValue((prev) => !prev);
    }, []);

    return [ value, toggle ] as const;
}