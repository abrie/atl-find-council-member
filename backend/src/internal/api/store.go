package api

import (
	"backend/internal/api/models/address"
	"backend/internal/api/models/record"
)

type Store struct {
	Directory        string
	Stop             chan struct{}
	AddressSubmitter address.Submitter
	RecordSubmitter  record.Submitter
	CouncilStore     string
}

func NewProductionStore(directory string, stop chan struct{}) *Store {
	return &Store{
		Directory:        directory,
		Stop:             stop,
		AddressSubmitter: address.ProductionSubmitter{},
		RecordSubmitter:  record.ProductionSubmitter{},
	}
}

func NewTestStore(directory string, stop chan struct{}) *Store {
	return &Store{
		Directory:        directory,
		Stop:             stop,
		AddressSubmitter: address.TestSubmitter{},
		RecordSubmitter:  record.TestSubmitter{},
	}
}
