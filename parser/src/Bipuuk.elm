module Bipuuk exposing (Tree, empty, fromString, toDigits, toDyckWord)

import BigInt exposing (BigInt, add, div, mul, sub)
import Parser exposing ((|.), (|=), Parser)


type Tree
    = Leaf
    | Node Tree Tree


empty : Tree
empty =
    Leaf


zero =
    BigInt.fromInt 0


one =
    BigInt.fromInt 1


two =
    BigInt.fromInt 2


sqrt : BigInt -> BigInt
sqrt b =
    if BigInt.lt b zero then
        zero

    else if b == zero then
        zero

    else if b == one then
        one

    else
        let
            good x =
                BigInt.lte (mul x x) b

            refine x =
                if good x then
                    x

                else
                    refine (div (add x (div b x)) two)
        in
        refine (div b two)


pair : BigInt -> BigInt -> BigInt
pair x y =
    let
        y_ =
            add y one
    in
    case BigInt.compare x y of
        LT ->
            sub (mul y_ y_) x

        EQ ->
            add (mul x x) y_

        GT ->
            add (mul x x) y_


unpair : BigInt -> ( BigInt, BigInt )
unpair z =
    if BigInt.lte z zero then
        ( zero, zero )

    else
        let
            m =
                sqrt (sub z one)

            h =
                add (mul m (add m one)) one
        in
        case BigInt.compare z h of
            LT ->
                ( m, sub m (sub h z) )

            EQ ->
                ( m, m )

            GT ->
                ( sub m (sub z h), m )


fromBigInt : BigInt -> Tree
fromBigInt b =
    if BigInt.lt b zero then
        Leaf

    else if b == zero then
        Leaf

    else if b == one then
        Node Leaf Leaf

    else
        let
            ( x, y ) =
                unpair b
        in
        Node (fromBigInt x) (fromBigInt y)


toBigInt : Tree -> BigInt
toBigInt t =
    case t of
        Leaf ->
            zero

        Node x y ->
            pair (toBigInt x) (toBigInt y)


digitsParser : Parser String
digitsParser =
    Parser.getChompedString <|
        Parser.succeed ()
            |. Parser.chompIf Char.isDigit
            |. Parser.chompWhile Char.isDigit


bigintParser : Parser BigInt
bigintParser =
    Parser.map
        (BigInt.fromString >> Maybe.withDefault zero)
        digitsParser


treeParser : Parser Tree
treeParser =
    Parser.oneOf
        [ Parser.succeed Node
            |. Parser.symbol "("
            |= Parser.lazy (\_ -> treeParser)
            |. Parser.symbol ")"
            |= Parser.lazy (\_ -> treeParser)
        , Parser.map fromBigInt bigintParser
        , Parser.succeed Leaf
        ]
        |. Parser.spaces


textParser : Parser Tree
textParser =
    Parser.succeed identity
        |. Parser.spaces
        |= treeParser
        |. Parser.end


fromString : String -> Result String Tree
fromString =
    Parser.run textParser
        >> Result.mapError Parser.deadEndsToString


toDyckWord : Tree -> String
toDyckWord t =
    case t of
        Leaf ->
            ""

        Node x y ->
            "(" ++ toDyckWord x ++ ")" ++ toDyckWord y


toDigits : Tree -> String
toDigits =
    toBigInt >> BigInt.toString
