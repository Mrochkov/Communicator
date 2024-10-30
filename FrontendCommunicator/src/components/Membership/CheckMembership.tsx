import {useMembershipContext} from "../../context/MembershipContext.tsx";
import {useParams} from "react-router-dom";
import {useEffect} from "react";

interface CheckMembershipProps {
    children: any;
}


const CheckMembership: React.FC<CheckMembershipProps> = ({children}) => {
    const {serverId} = useParams();
    const {isMember} = useMembershipContext();

        useEffect(() => {
            const membershipCheck = async () => {
                try {
                    await isMember(Number(serverId));
                }catch (error) {
                    console.log("Error checking membership status", error);

                }
            };
            membershipCheck();

        }, [serverId]);
        return <>{children}</>;
}
export default CheckMembership;