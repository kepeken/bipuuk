module Bipuuk.Circle exposing (none, render)

import Bipuuk exposing (Tree(..))
import Html exposing (Html)
import Svg
import Svg.Attributes


type alias PositionedTree =
    { tree : Tree
    , depth : Float
    , turn : Float
    }


getBii : Tree -> Tree
getBii tree =
    case tree of
        Null ->
            Null

        Node bii _ ->
            bii


getPuu : Tree -> Tree
getPuu tree =
    case tree of
        Null ->
            Null

        Node _ puu ->
            puu


radius : number -> number
radius depth =
    40 + 20 * depth


polar : ( Float, Float ) -> String
polar ( depth, turn ) =
    let
        ( x, y ) =
            fromPolar ( radius depth, turns turn )
    in
    String.fromFloat x ++ " " ++ String.fromFloat y


normalize : Float -> Float
normalize turn =
    if turn < 0 then
        turn + 1

    else if turn >= 1 then
        turn - 1

    else
        turn


line : Float -> Float -> Float -> List String -> List String
line d0 d1 turn acc =
    acc
        |> (::) ("M " ++ polar ( d0, turn ))
        |> (::) ("L " ++ polar ( d1, turn ))


arc : Float -> Float -> Float -> String -> String -> List String -> List String
arc depth t0 t1 large clockwise acc =
    acc
        |> (::) ("M " ++ polar ( depth, t0 ))
        |> (::)
            (String.join " "
                [ "A"
                , String.fromFloat <| radius depth
                , String.fromFloat <| radius depth
                , String.fromFloat <| turns t0
                , large
                , clockwise
                , polar ( depth, t1 )
                ]
            )


adjacentPairList : List a -> List ( a, a )
adjacentPairList list =
    case list of
        [] ->
            []

        first :: xs ->
            case adjacentPairList xs of
                [] ->
                    [ ( first, first ) ]

                ( last, second ) :: ys ->
                    ( last, first ) :: ( first, second ) :: ys


traverseHorizontally : ( List String, List PositionedTree ) -> ( List String, List PositionedTree )
traverseHorizontally ( cmds_, treeList ) =
    adjacentPairList treeList
        |> List.foldl
            (\( a, b ) ( cmds, next ) ->
                let
                    delta =
                        1 - normalize (b.turn - a.turn)
                in
                case ( getPuu a.tree, getBii b.tree ) of
                    ( Null, Null ) ->
                        ( cmds, next )

                    ( aPuu, Null ) ->
                        let
                            nextATurn =
                                normalize (a.turn - delta / 2)
                        in
                        ( cmds
                            |> arc a.depth a.turn nextATurn "0" "0"
                        , next
                            |> (::) { a | tree = aPuu, turn = nextATurn }
                        )

                    ( Null, bBii ) ->
                        let
                            nextBTurn =
                                normalize (b.turn + delta / 2)
                        in
                        ( cmds
                            |> arc b.depth b.turn nextBTurn "0" "1"
                        , next
                            |> (::) { b | tree = bBii, turn = nextBTurn }
                        )

                    ( aPuu, bBii ) ->
                        let
                            nextATurn =
                                normalize (a.turn - delta / 4)

                            nextBTurn =
                                normalize (b.turn + delta / 4)
                        in
                        ( cmds
                            |> arc a.depth a.turn nextATurn "0" "0"
                            |> arc b.depth b.turn nextBTurn "0" "1"
                        , next
                            |> (::) { a | tree = aPuu, turn = nextATurn }
                            |> (::) { b | tree = bBii, turn = nextBTurn }
                        )
            )
            ( cmds_, [] )


traverseVertically : ( List String, List PositionedTree ) -> ( List String, List PositionedTree )
traverseVertically ( cmds_, treeList ) =
    treeList
        |> List.foldl
            (\a ( cmds, next ) ->
                if getBii a.tree == Null && getPuu a.tree == Null then
                    ( cmds, next )

                else
                    let
                        nextADepth =
                            a.depth + 1
                    in
                    ( cmds
                        |> line a.depth nextADepth a.turn
                    , next
                        |> (::) { a | depth = nextADepth }
                    )
            )
            ( cmds_, [] )


traverse_ : ( List String, List PositionedTree ) -> List String
traverse_ ( cmds_, treeList ) =
    ( cmds_, treeList )
        |> traverseVertically
        |> traverseHorizontally
        |> (\( cmds, rest ) ->
                case rest of
                    [] ->
                        cmds

                    _ ->
                        traverse_ ( cmds, rest )
           )


traverse : Tree -> String
traverse tree =
    traverse_ ( [], [ { tree = tree, depth = 0, turn = 1 / 4 } ] )
        |> List.reverse
        |> String.join "\n"


none : Html msg
none =
    Svg.svg [] []


render : Tree -> Html msg
render root =
    case root of
        Null ->
            none

        _ ->
            let
                size =
                    radius (Bipuuk.height root * 2) + 10
            in
            Svg.svg
                [ Svg.Attributes.width <| String.fromInt size
                , Svg.Attributes.height <| String.fromInt size
                , Svg.Attributes.viewBox <|
                    String.join " " <|
                        List.map String.fromInt
                            [ -size // 2, -size // 2, size, size ]
                ]
                [ Svg.circle
                    [ Svg.Attributes.cx "0"
                    , Svg.Attributes.cy "0"
                    , Svg.Attributes.r <| String.fromInt <| radius 0
                    , Svg.Attributes.stroke "black"
                    , Svg.Attributes.fill "none"
                    ]
                    []
                , Svg.path
                    [ Svg.Attributes.strokeLinecap "round"
                    , Svg.Attributes.stroke "black"
                    , Svg.Attributes.fill "none"
                    , Svg.Attributes.d <| traverse root
                    ]
                    []
                ]
