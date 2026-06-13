import { Tooltip, Badge } from "@mui/material"

export default function productBadge({ children, ...props }) {

    return(
        <Tooltip
        {...props}>
            <Badge
            color='success'
            max={99}
            badgeContent={props.productQuantity}>
                {children}
            </Badge>
        </Tooltip>
    )
}