module Bipuuk.CircleRenderer exposing (renderCircle)

import Bipuuk exposing (Tree(..))
import Svg exposing (Svg)
import Svg.Attributes


type alias Polar =
    { depth : Int, turn : Float }


depthToRadius : Int -> Float
depthToRadius depth =
    40 + 40 * toFloat depth


polarToString : Polar -> String
polarToString polar =
    let
        ( x, y ) =
            fromPolar ( depthToRadius polar.depth, turns polar.turn )
    in
    String.fromFloat x ++ " " ++ String.fromFloat y


moveto : Polar -> String
moveto polar =
    "M " ++ polarToString polar ++ "\n"


line : Polar -> Polar -> String
line from to =
    moveto from
        ++ ("L " ++ polarToString to ++ "\n")


arc : Polar -> Polar -> Int -> Int -> String
arc from to large clockwise =
    moveto from
        ++ String.join " "
            [ "A"
            , String.fromFloat <| depthToRadius from.depth
            , String.fromFloat <| depthToRadius from.depth
            , String.fromFloat <| turns from.turn
            , String.fromInt large
            , String.fromInt clockwise
            , polarToString to
            ]
        ++ "\n"


renderCircle : Tree -> Svg msg
renderCircle tree =
    let
        width =
            depthToRadius (Bipuuk.height tree) * 2
    in
    Svg.svg
        [ Svg.Attributes.width <| String.fromFloat width
        , Svg.Attributes.height <| String.fromFloat width
        , Svg.Attributes.viewBox <|
            String.join ", " <|
                List.map String.fromFloat
                    [ -width / 2
                    , -width / 2
                    , width
                    , width
                    ]
        ]
        [ Svg.path
            [ Svg.Attributes.d <| renderCircleHelp [ ( tree, Polar 0 (1 / 4) ) ] ""
            , Svg.Attributes.strokeLinecap "round"
            , Svg.Attributes.stroke "black"
            , Svg.Attributes.fill "none"
            ]
            []
        ]


renderCircleHelp : List ( Tree, Polar ) -> String -> String
renderCircleHelp curr d =
    let
        ( left, right, lineSeg ) =
            renderCircleHelpLine curr

        ( next, arcSeg ) =
            renderCircleHelpArc ( left, right )
    in
    if next == [] then
        lineSeg ++ arcSeg ++ d

    else
        renderCircleHelp next (lineSeg ++ arcSeg ++ d)


renderCircleHelpLine : List ( Tree, Polar ) -> ( List ( Tree, Polar ), List ( Tree, Polar ), String )
renderCircleHelpLine =
    List.foldr
        (\( tree, polar ) ( lacc, racc, d ) ->
            case tree of
                Leaf ->
                    ( lacc, racc, d )

                Node Leaf Leaf ->
                    ( lacc, racc, d )

                Node x y ->
                    let
                        nextPolar =
                            Polar (polar.depth + 1) polar.turn
                    in
                    ( ( x, nextPolar ) :: lacc
                    , ( y, nextPolar ) :: racc
                    , line polar nextPolar ++ d
                    )
        )
        ( [], [], "" )


zip : List a -> List b -> List ( a, b )
zip =
    List.map2 Tuple.pair


rotate : List a -> List a
rotate xs =
    case xs of
        [] ->
            []

        h :: t ->
            t ++ [ h ]


normalize : Float -> Float
normalize turn =
    turn - toFloat (floor turn)


renderCircleHelpArc : ( List ( Tree, Polar ), List ( Tree, Polar ) ) -> ( List ( Tree, Polar ), String )
renderCircleHelpArc ( lacc, racc ) =
    zip lacc (rotate racc)
        |> List.foldr
            (\( ( ltree, lpolar ), ( rtree, rpolar ) ) ( acc, d ) ->
                let
                    delta_ =
                        normalize (rpolar.turn - lpolar.turn)

                    epsilon =
                        1.0e-15

                    delta =
                        if delta_ <= epsilon then
                            1

                        else
                            delta_
                in
                case ( ltree, rtree ) of
                    -- never
                    ( Leaf, Leaf ) ->
                        ( acc, d )

                    ( _, Leaf ) ->
                        let
                            lnext =
                                Polar lpolar.depth <| normalize (lpolar.turn + delta / 2)
                        in
                        ( ( ltree, lnext ) :: acc
                        , arc lpolar lnext 0 1 ++ d
                        )

                    ( Leaf, _ ) ->
                        let
                            rnext =
                                Polar rpolar.depth <| normalize (rpolar.turn - delta / 2)
                        in
                        ( ( rtree, rnext ) :: acc
                        , arc rpolar rnext 0 0 ++ d
                        )

                    _ ->
                        let
                            lnext =
                                Polar lpolar.depth <| normalize (lpolar.turn + delta / 4)

                            rnext =
                                Polar rpolar.depth <| normalize (rpolar.turn - delta / 4)
                        in
                        ( ( ltree, lnext ) :: ( rtree, rnext ) :: acc
                        , arc lpolar lnext 0 1 ++ arc rpolar rnext 0 0 ++ d
                        )
            )
            ( [], "" )
